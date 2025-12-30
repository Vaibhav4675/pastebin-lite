import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function badRequest(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
}

function makeId(): string {
    return crypto.randomBytes(6).toString("base64url");
}

export async function POST(req: NextRequest) {
    let body: any;
    try {
        body = await req.json();
    } catch {
        return badRequest("Invalid JSON body");
    }

    const content = body?.content;
    const ttlSeconds = body?.ttl_seconds;
    const maxViews = body?.max_views;

    //Validations
    if (typeof content !== "string" || content.trim().length === 0) {
        return badRequest("content must be a non-empty string");
    }
    if (ttlSeconds !== undefined) {
        if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
            return badRequest("ttl_seconds must be an integer >= 1");
        }
    }
    if (maxViews !== undefined) {
        if (!Number.isInteger(maxViews) || maxViews < 1) {
            return badRequest("max_views must be an integer >= 1");
        }
    }

    const id = makeId();
    const nowMs= Date.now();
    const expiresAt =     ttlSeconds !== undefined ? BigInt(nowMs + ttlSeconds * 1000) : null;

    await prisma.paste.create({
        data: {
            id,
            content,
            createdAtMs:BigInt(nowMs),
            expiresAtMs: expiresAt,
            maxViews: maxViews ?? null,
            viewsUsed: 0,
        },
    });

    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const url = `${proto}://${host}/p/${id}`;

    return NextResponse.json({ id, url }, { status: 201 });
}
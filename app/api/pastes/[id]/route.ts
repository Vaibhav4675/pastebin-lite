import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNowMs } from "@/lib/nowMs";

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; 
  const nowMs = getNowMs(req);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const paste = await tx.paste.findUnique({ where: { id } });
      if (!paste) return { status: 404 as const };

      // TTL check
      if (paste.expiresAtMs !== null && BigInt(nowMs) >= paste.expiresAtMs) {
        return { status: 404 as const };
      }

      // Max views check
      if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
        return { status: 404 as const };
      }

      // Increment view count
      const updated = await tx.paste.update({
        where: { id },
        data: { viewsUsed: { increment: 1 } },
      });

      const remainingViews =
        updated.maxViews === null
          ? null
          : Math.max(updated.maxViews - updated.viewsUsed, 0);

      return {
        status: 200 as const,
        body: {
          id: updated.id,
          content: updated.content,
          expires_at:
            updated.expiresAtMs === null
              ? null
              : new Date(Number(updated.expiresAtMs)).toISOString(),
          remaining_views: remainingViews,
        },
      };
    });

    if (result.status === 404) return notFound();
    return NextResponse.json(result.body, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

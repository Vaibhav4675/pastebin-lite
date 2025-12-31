"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PasteResponse = {
  id: string;
  content: string;
  expires_at: string | null;
  remaining_views: number | null;
};

type ErrorResponse = { error: string };

export default function PasteClient({ id }: { id: string }) {
  const [data, setData] = useState<PasteResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/pastes/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const body = (await res.json()) as PasteResponse | ErrorResponse;

        if (cancelled) return;

        if (!res.ok) {
          setError(("error" in body && body.error) || "Paste not available");
          setData(null);
          return;
        }

        setData(body as PasteResponse);
        setError("");
      } catch {
        if (cancelled) return;
        setError("Network error while loading paste.");
        setData(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Paste not available</h1>
        <p style={{ marginTop: 12, color: "#555" }}>
          This paste does not exist, has expired, or has reached its view limit.
        </p>
        <div style={{ marginTop: 16 }}>
          <Link href="/" style={{ textDecoration: "underline" }}>
            Create a new paste
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Loading paste…</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Paste</h1>

      <p style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
        Remaining views:{" "}
        {data.remaining_views === null ? "Unlimited" : data.remaining_views}
      </p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        {data.content}
      </pre>
    </main>
  );
}

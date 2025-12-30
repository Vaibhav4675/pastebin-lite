"use client";

import { useState } from "react";

type CreateResponse = { id: string; url: string };
type ErrorResponse = { error: string };

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<CreateResponse | null>(null);
  const [error, setError] = useState<string>("");

  async function onCreate() {
    setError("");
    setCreated(null);

    // Optional: client-side guard (server validation is the source of truth)
    if (content.trim().length === 0) {
      setError("Content is required.");
      return;
    }

    const payload: any = { content };

    if (ttlSeconds.trim().length > 0) payload.ttl_seconds = Number(ttlSeconds);
    if (maxViews.trim().length > 0) payload.max_views = Number(maxViews);

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as CreateResponse | ErrorResponse;

      if (!res.ok) {
        setError(("error" in data && data.error) || "Request failed.");
        return;
      }

      setCreated(data as CreateResponse);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch {
      setError("Network error. Is the dev server running?");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Pastebin</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Create a paste and share the link.
        </p>

        <label className="mt-6 block text-sm font-medium">Content</label>
        <textarea
          className="mt-2 w-full rounded-lg border border-zinc-200 p-3 font-mono text-sm outline-none focus:border-zinc-400"
          rows={10}
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              TTL (seconds) <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none focus:border-zinc-400"
              placeholder="e.g. 60"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Max Views <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none focus:border-zinc-400"
              placeholder="e.g. 5"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              inputMode="numeric"
            />
          </div>
        </div>

        <button
          className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          onClick={onCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Paste"}
        </button>

        {/* Errors clearly */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success clearly */}
        {created && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <div className="font-medium">Paste created!</div>
            <div className="mt-2 break-all">
              <a className="underline" href={created.url} target="_blank" rel="noreferrer">
                {created.url}
              </a>
            </div>
            <div className="mt-2 text-xs text-green-900/70">
              Paste ID: {created.id}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

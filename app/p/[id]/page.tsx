import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const nowMs = Date.now();

  const result = await prisma.$transaction(async (tx) => {
    const paste = await tx.paste.findUnique({ where: { id } });
    if (!paste) return null;

    // TTL check
    if (paste.expiresAtMs !== null && BigInt(nowMs) >= paste.expiresAtMs) {
      return null;
    }

    // Max views check
    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      return null;
    }

    // Count a view on successful HTML view
    await tx.paste.update({
      where: { id },
      data: { viewsUsed: { increment: 1 } },
    });

    // Re-read to return content 
    const updated = await tx.paste.findUnique({ where: { id } });
    return updated;
  });

  if (!result) notFound();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Paste</h1>
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
        {result.content}
      </pre>
    </main>
  );
}

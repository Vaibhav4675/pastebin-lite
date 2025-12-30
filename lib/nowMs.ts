import type { NextRequest } from "next/server";

export function getNowMs(req: NextRequest): number {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const n = Number(header);
      if (Number.isFinite(n)) return n;
    }
  }
  return Date.now();
}

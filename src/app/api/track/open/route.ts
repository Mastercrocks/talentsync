export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { incrOpen } from "@/lib/metricsStore";

// Note: App Router route handlers run on server; we cannot use useDB hook here.
// We'll store metrics in local storage on client, so as a fallback this endpoint just returns a pixel.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const cid = url.searchParams.get("cid") || "";
  const uid = url.searchParams.get("uid") || "";
  if (cid && uid) {
    try { await incrOpen(cid, uid); } catch {}
  }
  // 1x1 transparent gif
  const pixel = Buffer.from(
    "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );
  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

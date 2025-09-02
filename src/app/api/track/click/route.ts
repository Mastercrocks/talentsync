export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { incrClick } from "@/lib/metricsStore";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url") || "/";
  const cid = url.searchParams.get("cid") || "";
  const uid = url.searchParams.get("uid") || "";
  if (cid && uid && target) {
    try { await incrClick(cid, uid, target); } catch {}
  }
  // Simply redirect to the destination
  return NextResponse.redirect(target, { status: 302 });
}

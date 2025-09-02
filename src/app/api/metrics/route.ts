export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { readStore } from "@/lib/metricsStore";

export async function GET() {
  const st = await readStore();
  return NextResponse.json(st);
}

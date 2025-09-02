export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/serverDB";

type DB = {
  contacts: unknown[];
  lists: unknown[];
  campaigns: unknown[];
  templates: unknown[];
  automations: unknown[];
  updatedAt?: number;
};

const EMPTY: DB = { contacts: [], lists: [], campaigns: [], templates: [], automations: [], updatedAt: Date.now() };

export async function GET() {
  const data = readDB<DB>(EMPTY);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DB;
    // minimal shape guard
    if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid" }, { status: 400 });
    const keys = ["contacts","lists","campaigns","templates","automations"] as const;
    for (const k of keys) {
      const v = (body as Record<string, unknown>)[k];
      if (!Array.isArray(v)) return NextResponse.json({ error: `invalid ${k}` }, { status: 400 });
    }
    const withTs = { ...body, updatedAt: Date.now() } as DB;
    writeDB(withTs);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

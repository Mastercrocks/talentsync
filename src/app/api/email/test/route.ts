export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

type Body = { to: string };

export async function POST(req: Request) {
  try {
    const { to } = (await req.json()) as Body;
    if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
      return NextResponse.json({ error: "Invalid 'to' email" }, { status: 400 });
    }
    const html = `<div style="font-family:Arial,sans-serif;">Hello 👋<br/>This is a test email from TalentSync.<br/><br/>If you received this, SMTP is working.<br/><small>${new Date().toISOString()}</small></div>`;
  const res = await sendEmail(to, "TalentSync: SMTP test", html);
  const id = (typeof res === 'object' && res && 'id' in res) ? (res as { id?: string }).id ?? null : null;
  return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

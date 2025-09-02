export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function GET() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;
  const smtpEnabled = Boolean(smtpHost && smtpUser && smtpPass);

  const resendKey = process.env.RESEND_API_KEY || "";
  const fromEmail = process.env.FROM_EMAIL || "no-reply@talentsync.local";
  const resendEnabled = Boolean(resendKey);

  const mode = smtpEnabled ? "smtp" : (resendEnabled ? "resend" : "dev");
  const from = smtpEnabled ? (smtpFrom || fromEmail) : fromEmail;

  return NextResponse.json({
    smtp: { enabled: smtpEnabled, host: smtpHost || null, user: smtpUser || null, from: smtpFrom || null },
    resend: { enabled: resendEnabled, from: fromEmail },
    activeMode: mode,
    from,
  });
}

import { Resend } from "resend";
import type { CreateEmailResponse } from "resend";
import nodemailer from "nodemailer";

// Minimal mailer wrapper; requires RESEND_API_KEY and FROM_EMAIL in env
const resendKey = process.env.RESEND_API_KEY || "";
const fromEmail = process.env.FROM_EMAIL || "no-reply@talentsync.local";
export const mailer: Resend | null = resendKey ? new Resend(resendKey) : null;

// Optional SMTP transport (e.g., PrivateEmail)
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpSecureEnv = process.env.SMTP_SECURE;
const smtpSecure = typeof smtpSecureEnv === "string" ? smtpSecureEnv.toLowerCase() === "true" : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM; // e.g., "hiring@talentsync.shop"

const smtpEnabled = Boolean(smtpHost && smtpUser && smtpPass);
const smtpTransporter = smtpEnabled
  ? nodemailer.createTransport({
      host: smtpHost!,
      port: smtpPort ?? 587,
      secure: smtpSecure ?? (smtpPort === 465),
      auth: { user: smtpUser!, pass: smtpPass! },
    })
  : null;

function rewriteLinksForTracking(html: string, campaignId: string, contactId: string) {
  return html
    .replaceAll("[Job URL]", `/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent('[Job URL]')}`)
    .replaceAll("[Post URL]", `/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent('[Post URL]')}`)
    .replace(/href=\"(https?:[^\"]+)\"/g, (_m, url) => `href="/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent(url)}"`)
    + `<img src="/api/track/open?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}" width="1" height="1" style="display:none" alt=""/>`;
}

export async function sendEmail(to: string, subject: string, html: string) {
  // Prefer SMTP if configured (works with PrivateEmail/other SMTP providers)
  if (smtpTransporter) {
    const info = await smtpTransporter.sendMail({
      from: smtpFrom || fromEmail,
      to,
      subject,
      html,
    });
    return { id: info.messageId } as const;
  }

  // Fallback to Resend if configured
  if (resendKey && mailer) {
    const res: CreateEmailResponse = await mailer.emails.send({ from: fromEmail, to, subject, html });
    if (res.error) throw new Error(res.error.message || "send failed");
    return res;
  }

  // Dev mode: simulate send
  return { id: `dev_${Math.random().toString(36).slice(2, 8)}` } as const;
}

export function renderTemplate(html: string, tokens: Record<string,string>) {
  let out = html;
  for (const [k, v] of Object.entries(tokens)) {
    out = out.replaceAll(`[${k}]`, v);
  }
  return out;
}

export function prepareTrackedHtml(rawHtml: string, tokens: Record<string,string>, campaignId: string, contactId: string) {
  const filled = renderTemplate(rawHtml, tokens);
  return rewriteLinksForTracking(filled, campaignId, contactId);
}

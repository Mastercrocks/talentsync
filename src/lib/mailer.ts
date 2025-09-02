import { Resend } from "resend";
import type { CreateEmailResponse } from "resend";

// Minimal mailer wrapper; requires RESEND_API_KEY and FROM_EMAIL in env
const resendKey = process.env.RESEND_API_KEY || "";
const fromEmail = process.env.FROM_EMAIL || "no-reply@talentsync.local";
export const mailer = new Resend(resendKey);

function rewriteLinksForTracking(html: string, campaignId: string, contactId: string) {
  return html
    .replaceAll("[Job URL]", `/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent('[Job URL]')}`)
    .replaceAll("[Post URL]", `/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent('[Post URL]')}`)
    .replace(/href=\"(https?:[^\"]+)\"/g, (_m, url) => `href="/api/track/click?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}&url=${encodeURIComponent(url)}"`)
    + `<img src="/api/track/open?cid=${encodeURIComponent(campaignId)}&uid=${encodeURIComponent(contactId)}" width="1" height="1" style="display:none" alt=""/>`;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resendKey) {
    // In dev without key, pretend ok
    return { id: `dev_${Math.random().toString(36).slice(2, 8)}` } as const;
  }
  const res: CreateEmailResponse = await mailer.emails.send({ from: fromEmail, to, subject, html });
  if (res.error) throw new Error(res.error.message || "send failed");
  return res;
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

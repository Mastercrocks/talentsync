export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prepareTrackedHtml, sendEmail } from "@/lib/mailer";
import { builtinTemplates } from "@/lib/templates";
import { type EmailTemplate } from "@/lib/types";
import { incrSends } from "@/lib/metricsStore";

// In-memory cache of DB for serverless demo (not production-safe). We rely on client persistence.
// The API accepts a payload describing which campaign to send and tokens.

type SendPayload = {
  campaignId: string;
  subject: string;
  templateId: string;
  html?: string;
  recipients: { id: string; email: string; firstName?: string; companyName?: string }[];
  tokens?: Record<string,string>;
};

export async function POST(req: Request) {
  const body = (await req.json()) as SendPayload;
  const template: EmailTemplate | undefined = body.html
    ? { id: body.templateId, name: "", defaultSubject: body.subject, html: body.html }
    : [...builtinTemplates].find(t => t.id === body.templateId);
  if (!template) return NextResponse.json({ error: "template not found" }, { status: 400 });

  const tokensBase = body.tokens || {};
  let sent = 0;
  for (const r of body.recipients) {
    const tokens = { ...tokensBase, "First Name": r.firstName || "there", "Company Name": r.companyName || "" };
    const html = prepareTrackedHtml(template.html, tokens, body.campaignId, r.id);
    try {
      await sendEmail(r.email, body.subject, html);
      sent++;
  } catch {
      // continue
    }
  }
  try { await incrSends(body.campaignId, body.recipients.map(r=>r.id)); } catch {}
  return NextResponse.json({ ok: true, sent });
}

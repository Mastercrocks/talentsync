import { EmailTemplate } from "./types";

export const studentJobAlertTemplate: EmailTemplate = {
  id: "tpl_student_jobs",
  name: "Student Job Notification",
  description: "Curated roles with personalized greeting and CTA",
  defaultSubject: "New roles for [Job Title] this week",
  html: `
  <div style="font-family:Inter,Arial,sans-serif;background:#F3F4F6;padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <tr><td style="padding:24px 24px 8px 24px">
        <div style="color:#2563EB;font-weight:700;font-size:18px">TalentSync</div>
        <h1 style="margin:12px 0 4px 0;font-size:20px;color:#0f172a">Hi [First Name],</h1>
        <p style="margin:0;color:#475569">We found fresh opportunities for <strong>[Job Title]</strong> you might like.</p>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px">
        <div style="height:1px;background:#e5e7eb"></div>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px">
        <div style="background:#F8FAFC;border:1px solid #e5e7eb;border-radius:10px;padding:16px">
          <div style="font-size:14px;color:#0f172a;margin-bottom:8px"><strong>Recommended role</strong></div>
          <div style="font-size:14px;color:#475569;margin-bottom:12px">Based on your skills and interests</div>
          <a href="[Job URL]" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600">View job</a>
        </div>
      </td></tr>
      <tr><td style="padding:0 24px 24px 24px;color:#64748b;font-size:12px">You’re receiving these updates as a member of TalentSync. Manage preferences or unsubscribe at any time.</td></tr>
    </table>
  </div>`
};

export const employerFreePostsTemplate: EmailTemplate = {
  id: "tpl_employer_free",
  name: "Employer Two Free Posts",
  description: "Promotion: post two jobs free, no credit card",
  defaultSubject: "Post 2 jobs for free on TalentSync – no credit card needed",
  html: `
  <div style="font-family:Inter,Arial,sans-serif;background:#F3F4F6;padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <tr><td style="padding:24px 24px 8px 24px">
        <div style="color:#2563EB;font-weight:700;font-size:18px">TalentSync</div>
        <h1 style="margin:12px 0 4px 0;font-size:20px;color:#0f172a">Hello [Company Name],</h1>
        <p style="margin:0;color:#475569">Grow your reach: try TalentSync with <strong>2 free job postings</strong>. No credit card required.</p>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px">
        <div style="height:1px;background:#e5e7eb"></div>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#0f172a">• Post to a curated student audience</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#0f172a">• Smart matching and analytics built in</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#0f172a">• Fast approval, easy editing</td>
          </tr>
        </table>
        <div style="margin-top:12px">
          <a href="[Post URL]" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600">Claim free posts</a>
        </div>
      </td></tr>
      <tr><td style="padding:0 24px 24px 24px;color:#64748b;font-size:12px">Offer available for new employer accounts. Terms apply.</td></tr>
    </table>
  </div>`
};

export const builtinTemplates: EmailTemplate[] = [studentJobAlertTemplate, employerFreePostsTemplate];

import { EmailTemplate } from "./types";

export const studentJobAlertTemplate: EmailTemplate = {
  id: "tpl_student_jobs",
  name: "Student Job Notification",
  description: "Curated roles with personalized greeting and CTA",
  defaultSubject: "New roles for [Job Title] this week",
  html: `
  <div style="font-family:Inter,Arial,sans-serif;background:#F3F4F6;padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">
      <tr><td style="padding:24px 24px 8px 24px">
        <div style="color:#2563EB;font-weight:800;font-size:18px;letter-spacing:.2px">TalentSync</div>
        <h1 style="margin:12px 0 4px 0;font-size:22px;color:#0f172a">Hi [First Name],</h1>
        <p style="margin:0;color:#475569">Here are new opportunities tailored for <strong>[Job Title]</strong>.</p>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px"><div style="height:1px;background:#e5e7eb"></div></td></tr>
      <tr><td style="padding:0 24px 18px 24px">
        <div style="background:#F8FAFC;border:1px solid #e5e7eb;border-radius:12px;padding:16px">
          <div style="font-size:15px;color:#0f172a;margin-bottom:6px"><strong>[Job Title] – [Company Name]</strong></div>
          <div style="font-size:14px;color:#475569;margin-bottom:6px">Location: [Location]</div>
          <div style="font-size:14px;color:#475569;margin-bottom:10px">Summary: [Job Summary]</div>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 12px 0">
            <tr>
              <td style="background:#EEF2FF;color:#3730A3;border-radius:999px;padding:6px 10px;font-size:12px;margin-right:8px">[Skill 1]</td>
              <td style="width:8px"></td>
              <td style="background:#ECFDF5;color:#065F46;border-radius:999px;padding:6px 10px;font-size:12px">[Skill 2]</td>
            </tr>
          </table>
          <a href="[Job URL]" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:700">Apply now</a>
        </div>
      </td></tr>
      <tr><td style="padding:0 24px 24px 24px;color:#64748b;font-size:12px">You’re receiving these updates as a member of TalentSync. Manage preferences or unsubscribe at any time.</td></tr>
    </table>
  </div>`
};

export const employerFreePostsTemplate: EmailTemplate = {
  id: "tpl_employer_promo",
  name: "Employer Promotion",
  description: "Professional outreach for employers with clear CTA",
  defaultSubject: "Reach qualified student talent with TalentSync",
  html: `
  <div style="font-family:Inter,Arial,sans-serif;background:#F3F4F6;padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">
      <tr><td style="padding:24px 24px 8px 24px">
        <div style="color:#2563EB;font-weight:800;font-size:18px;letter-spacing:.2px">TalentSync</div>
        <h1 style="margin:12px 0 4px 0;font-size:22px;color:#0f172a">Hello [Company Name],</h1>
        <p style="margin:0;color:#475569">Hire faster with targeted student outreach and built-in analytics.</p>
      </td></tr>
      <tr><td style="padding:0 24px 16px 24px"><div style="height:1px;background:#e5e7eb"></div></td></tr>
      <tr><td style="padding:0 24px 18px 24px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding:6px 0;font-size:14px;color:#0f172a">• Curated student audience by skills</td></tr>
          <tr><td style="padding:6px 0;font-size:14px;color:#0f172a">• Automated campaigns and ROI tracking</td></tr>
          <tr><td style="padding:6px 0;font-size:14px;color:#0f172a">• Simple job posting with instant preview</td></tr>
        </table>
        <div style="margin-top:12px">
          <a href="[Post URL]" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:700">Post a job</a>
        </div>
      </td></tr>
      <tr><td style="padding:0 24px 24px 24px;color:#64748b;font-size:12px">Questions? Reply to this email and our team will assist you.</td></tr>
    </table>
  </div>`
};

export const builtinTemplates: EmailTemplate[] = [studentJobAlertTemplate, employerFreePostsTemplate];

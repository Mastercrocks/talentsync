"use client";
import { useEffect, useMemo, useState } from "react";
import { useDB, addCampaign, uid } from "@/lib/store";
import { builtinTemplates } from "@/lib/templates";

export default function CampaignsPage() {
  const [db, setDb] = useDB();
  const [listType, setListType] = useState<"students"|"employers">(db.lists[0]?.type ?? "students");
  const listsOfType = useMemo(()=> db.lists.filter(l=>l.type===listType), [db.lists, listType]);
  const [listId, setListId] = useState<string>(listsOfType[0]?.id ?? "");
  const [templateId, setTemplateId] = useState<string>(builtinTemplates[0]?.id ?? "");
  const [subject, setSubject] = useState<string>(builtinTemplates.find(t=>t.id===templateId)?.defaultSubject ?? "");
  const [summary, setSummary] = useState<string | null>(null);
  // simple token fields for student job template
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [skill1, setSkill1] = useState("");
  const [skill2, setSkill2] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");

  const template = useMemo(()=> db.templates.find(t=>t.id===templateId) ?? builtinTemplates[0], [db.templates, templateId]);
  const selectedList = useMemo(()=> db.lists.find(l=>l.id===listId), [db.lists, listId]);
  const recipients = selectedList?.contactIds.length ?? 0;
  const listContacts = useMemo(()=> db.contacts.filter(c=> selectedList?.contactIds.includes(c.id)), [db.contacts, selectedList]);

  // keep listId in sync with selected type
  useEffect(()=>{
    const first = listsOfType[0]?.id ?? "";
    const currentIsCorrectType = db.lists.find(l=>l.id===listId)?.type === listType;
    if (!currentIsCorrectType) setListId(first);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listType, listsOfType.length]);

  function createCampaign() {
  if (!listId || !template) return;
    // require URL when template expects it
    const requiresJobUrl = template.id === "tpl_student_jobs";
    const requiresPostUrl = template.id === "tpl_employer_promo";
    if ((requiresJobUrl && !jobUrl) || (requiresPostUrl && !postUrl)) return;
    const list = db.lists.find(l=>l.id===listId);
    if (!list) return;
    const id = uid("cmp");
  addCampaign(db, setDb, { id, name: `${template.name} – ${new Date().toLocaleDateString()}`, subject: subject || template.defaultSubject, templateId: template.id, listId: list.id, listType: list.type, createdAt: Date.now() });
  setSummary(`Campaign created for "${list.name}" • recipients: ${list.contactIds.length}`);
  }

  async function sendNow(campaignId: string) {
    const tokens = {
      "First Name": firstName || "there",
      "Job Title": jobTitle || "Intern",
      "Company Name": companyName || "Acme Co.",
      "Location": location || "Remote",
      "Job Summary": jobSummary || "A great opportunity to grow your skills.",
      "Skill 1": skill1 || "React",
      "Skill 2": skill2 || "TypeScript",
      "Job URL": jobUrl || "#",
      "Post URL": postUrl || "#",
    };
    const res = await fetch("/api/campaigns/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        subject: subject || template.defaultSubject,
        templateId: template.id,
        recipients: listContacts.map(c => ({ id: c.id, email: c.email, firstName: c.firstName, companyName: c.companyName })),
        tokens,
      }),
    });
    const json = await res.json();
    // Update metrics locally
    const idx = db.campaigns.findIndex(c => c.id === campaignId);
    if (idx >= 0) {
      const c = db.campaigns[idx];
      const updated = { ...c, status: "sent" as const, metrics: { sends: (c.metrics?.sends ?? 0) + (json.sent || 0), opens: c.metrics?.opens ?? 0, clicks: c.metrics?.clicks ?? 0, conversions: c.metrics?.conversions ?? 0, links: c.metrics?.links ?? [] } };
      const next = [...db.campaigns];
      next[idx] = updated;
      setDb({ ...db, campaigns: next });
      setSummary(`Sent ${json.sent || 0} emails.`);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Email Campaigns</h1>
      {summary && (
        <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 text-sm">{summary}</div>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 lg:col-span-1">
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <button onClick={()=>setListType("students")} className={`rounded-md px-3 py-2 text-sm ${listType==='students'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Students</button>
              <button onClick={()=>setListType("employers")} className={`rounded-md px-3 py-2 text-sm ${listType==='employers'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Employers</button>
            </div>
            <label className="block">
              <div className="mb-1">Select List {selectedList ? `• Recipients: ${recipients}` : ""}</div>
              <select className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" value={listId} onChange={e=>setListId(e.target.value)}>
                {listsOfType.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
              </select>
            </label>
            <label className="block">
              <div className="mb-1">Select Template</div>
              <select className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" value={templateId} onChange={e=>{ setTemplateId(e.target.value); const t = db.templates.find(tt=>tt.id===e.target.value) ?? builtinTemplates.find(tt=>tt.id===e.target.value); if (t) setSubject(t.defaultSubject); }}>
                {[...db.templates, ...builtinTemplates.filter(t=>!db.templates.some(x=>x.id===t.id))].map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <div className="mb-1">Subject</div>
              <input className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" value={subject} onChange={e=>setSubject(e.target.value)} />
            </label>
            <button onClick={createCampaign} disabled={!listId} className="w-full rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Create Campaign</button>
          </div>
        </div>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 lg:col-span-2">
          <div className="text-sm font-medium mb-2">Preview</div>
          <div className="grid gap-3 sm:grid-cols-2 text-sm mb-3">
            {templateId === 'tpl_student_jobs' && (
              <>
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Job Title" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Company Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Skill 1" value={skill1} onChange={e=>setSkill1(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Skill 2" value={skill2} onChange={e=>setSkill2(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 sm:col-span-2" placeholder="Job Summary" value={jobSummary} onChange={e=>setJobSummary(e.target.value)} />
                <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 sm:col-span-2" placeholder="Job URL (required)" value={jobUrl} onChange={e=>setJobUrl(e.target.value)} />
              </>
            )}
            {templateId === 'tpl_employer_promo' && (
              <input className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="Post URL (required)" value={postUrl} onChange={e=>setPostUrl(e.target.value)} />
            )}
          </div>
          <div className="rounded-md border border-[var(--border)] overflow-hidden">
            <iframe title="preview" style={{ width: '100%', height: 520, border: '0' }} srcDoc={(template?.html || '')
              .replaceAll('[First Name]', firstName || 'there')
              .replaceAll('[Job Title]', jobTitle || 'Intern')
              .replaceAll('[Company Name]', companyName || 'Acme Co.')
              .replaceAll('[Location]', location || 'Remote')
              .replaceAll('[Job Summary]', jobSummary || 'A great opportunity to grow your skills.')
              .replaceAll('[Skill 1]', skill1 || 'React')
              .replaceAll('[Skill 2]', skill2 || 'TypeScript')
              .replaceAll('[Job URL]', jobUrl || '#')
              .replaceAll('[Post URL]', postUrl || '#')
            } />
          </div>
        </div>
      </div>

  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm font-medium mb-2">Recent Campaigns</div>
  <ul className="divide-y divide-[var(--border)] text-sm">
          {db.campaigns.map(c => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-[var(--muted-foreground)]">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--ts-primary)]/10 px-2 py-1 text-[11px] font-medium text-[var(--ts-primary)]">{c.status ?? 'draft'}</span>
                <button className="rounded-md border border-[var(--border)] px-2 py-1 text-xs" onClick={()=>sendNow(c.id)}>Send now</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

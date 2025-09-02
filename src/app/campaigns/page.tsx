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

  const template = useMemo(()=> db.templates.find(t=>t.id===templateId) ?? builtinTemplates[0], [db.templates, templateId]);
  const selectedList = useMemo(()=> db.lists.find(l=>l.id===listId), [db.lists, listId]);
  const recipients = selectedList?.contactIds.length ?? 0;

  // keep listId in sync with selected type
  useEffect(()=>{
    const first = listsOfType[0]?.id ?? "";
    const currentIsCorrectType = db.lists.find(l=>l.id===listId)?.type === listType;
    if (!currentIsCorrectType) setListId(first);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listType, listsOfType.length]);

  function createCampaign() {
  if (!listId || !template) return;
    const list = db.lists.find(l=>l.id===listId);
    if (!list) return;
    const id = uid("cmp");
  addCampaign(db, setDb, { id, name: `${template.name} – ${new Date().toLocaleDateString()}`, subject: subject || template.defaultSubject, templateId: template.id, listId: list.id, listType: list.type, createdAt: Date.now() });
  setSummary(`Campaign created for "${list.name}" • recipients: ${list.contactIds.length}`);
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
          <div className="rounded-md border border-[var(--border)] overflow-hidden">
            <iframe title="preview" style={{ width: '100%', height: 520, border: '0' }} srcDoc={template?.html ?? ''} />
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
              <span className="rounded-full bg-[var(--ts-primary)]/10 px-2 py-1 text-[11px] font-medium text-[var(--ts-primary)]">{c.status ?? 'draft'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

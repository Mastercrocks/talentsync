"use client";
import { useMemo, useState } from "react";
import { useDB, addAutomation, uid } from "@/lib/store";

export default function AutomationPage() {
  const [db, setDb] = useDB();
  const [listType, setListType] = useState<"students"|"employers">("students");
  const listsOfType = useMemo(()=> db.lists.filter(l=>l.type===listType), [db.lists, listType]);
  const [listId, setListId] = useState<string>(listsOfType[0]?.id ?? "");
  const [jobUrl, setJobUrl] = useState<string>("");

  function createAutomation() {
    if (!listId) return;
    const id = uid("auto");
    addAutomation(db, setDb, {
      id,
      name: `${listType === 'students' ? 'Students' : 'Employers'}: Welcome + Twice-weekly Jobs`,
      enabled: true,
      target: { listId, listType },
      steps: [
        { kind: "wait", days: 1 },
        { kind: "sendEmail", templateId: listType==='students'?"tpl_student_jobs":"tpl_employer_promo", subject: listType==='students'?"Welcome to TalentSync + your first roles":"Welcome to TalentSync" },
        { kind: "repeat", timesPerWeek: 2 },
        { kind: "sendEmail", templateId: listType==='students'?"tpl_student_jobs":"tpl_employer_promo", subject: listType==='students'?"New jobs this week – [Job Title]":"What's new this week", },
      ],
      createdAt: Date.now(),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Automation</h1>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex gap-2">
            <button onClick={()=>setListType('students')} className={`rounded-md px-3 py-2 text-sm ${listType==='students'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Students</button>
            <button onClick={()=>setListType('employers')} className={`rounded-md px-3 py-2 text-sm ${listType==='employers'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Employers</button>
          </div>
          <label className="text-sm">
            <div className="mb-1">Target List • Recipients: {db.lists.find(l=>l.id===listId)?.contactIds.length ?? 0}</div>
            <select className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" value={listId} onChange={e=>setListId(e.target.value)}>
              {listsOfType.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1">Job posting URL</div>
            <input className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" placeholder="https://your-site/job/123" value={jobUrl} onChange={e=>setJobUrl(e.target.value)} />
          </label>
        </div>
  <button onClick={createAutomation} className="mt-3 rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm font-medium text-white">Create Workflow</button>
      </div>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm font-medium mb-2">Existing Workflows</div>
  <ul className="divide-y divide-[var(--border)] text-sm">
          {db.automations.map(a => (
            <li key={a.id} className="py-2">
              <div className="font-medium">{a.name}</div>
              <div className="text-[var(--muted-foreground)]">Target: {a.target.listType || 'list'} → {a.target.listId} • Steps: {a.steps.map(s=>s.kind).join(" → ")}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

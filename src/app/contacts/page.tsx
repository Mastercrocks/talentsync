"use client";
import { useEffect, useMemo, useState } from "react";
import { useDB, addContact, upsertList, uid } from "@/lib/store";
import type { Contact } from "@/lib/types";
import CsvImport, { CsvRow } from "@/components/CsvImport";
import { normalizePhone, validateEmail } from "@/lib/validation";
import AddContactForm from "@/components/AddContactForm";

const filters = ["Skills", "Location", "Engagement Level"];

export default function ContactsPage() {
  const [db, setDb] = useDB();
  const [tab, setTab] = useState<"students" | "employers">("students");
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const list = useMemo(()=> db.lists.find(l=>l.type===tab), [db.lists, tab]);
  // Ensure default lists exist (run once on mount and when lists change)
  useEffect(() => {
    if (!db.lists.find(l=>l.type==='students')) {
      upsertList(db, setDb, { id: 'list_students', name: 'Students', type: 'students', contactIds: [] });
    }
    if (!db.lists.find(l=>l.type==='employers')) {
      upsertList(db, setDb, { id: 'list_employers', name: 'Employers', type: 'employers', contactIds: [] });
    }
  }, [db.lists, db, setDb]);

  function addSample() {
    const id = uid("c");
    if (tab === "students") {
      addContact(db, setDb, { id, email: `student-${id}@example.com`, firstName: "Alex", jobTitle: "Software Engineer", type: "students", skills: ["JS","React"], location: "Remote" });
    } else {
      addContact(db, setDb, { id, email: `hr-${id}@company.com`, companyName: "ACME Inc.", type: "employers", jobTitle: "HR" });
    }
    if (list) {
      upsertList(db, setDb, { ...list, contactIds: [id, ...list.contactIds] });
    }
  }

  function onImport(rows: CsvRow[]) {
    if (!list) return;
    const lower = (s?: string) => (s ?? "").toString().trim().toLowerCase();
  // Ensure a list exists for the current tab
  if (!list) return;
  const existingByEmail = new Map(db.contacts.map(c => [lower(c.email), c] as const));

  const toAdd: Contact[] = [];
  const updatedMap = new Map<string, Contact>();
    const linkIds: string[] = [];

    const parseSkills = (val?: string) => (val ?? "")
      .toString()
      .split(/[;,]/)
      .map(s => s.trim())
      .filter(Boolean);

  let added = 0; let updatedCount = 0; let skipped = 0;
  rows.forEach(r => {
      const email = (r.email || r.Email || r.contact || r.Contact || "").toString().trim();
  if (!validateEmail(email)) { skipped++; return; } // skip invalid emails
      const name = (r.name || r.Name || r.fullName || r["Full Name"] || r.firstName || r["First Name"] || r.companyName || r["Company Name"])?.toString().trim();
  const phoneRaw = (r.phone || r.Phone || r.telephone || r.Telephone || r.mobile || r.Mobile)?.toString().trim();
  const phone = normalizePhone(phoneRaw);

      const existing = existingByEmail.get(lower(email));
      if (existing) {
        const updated: Contact = { ...existing };
        // ensure type aligns with current tab
        updated.type = tab;
        if (name && !updated.name) updated.name = name;
        if (phone && !updated.phone) updated.phone = phone;
        if (tab === "students") {
          const fn = name?.split(" ")[0] || (r.firstName as string) || (r["First Name"] as string);
          if (fn && !updated.firstName) updated.firstName = fn;
          const jt = (r.jobTitle as string) || (r["Job Title"] as string);
          if (jt && !updated.jobTitle) updated.jobTitle = jt;
          const skills = parseSkills((r.skills as string) || (r.Skills as string));
          if (skills.length) {
            const cur = Array.isArray(updated.skills) ? updated.skills : [];
            updated.skills = Array.from(new Set([...cur, ...skills]));
          }
          const loc = (r.location as string) || (r.Location as string);
          if (loc && !updated.location) updated.location = loc;
        } else {
          const cn = (r.companyName as string) || (r["Company Name"] as string);
          if (cn && !updated.companyName) updated.companyName = cn;
          const jt = (r.jobTitle as string) || (r["Job Title"] as string);
          if (jt && !updated.jobTitle) updated.jobTitle = jt;
        }
        updatedMap.set(existing.id, updated);
  linkIds.push(existing.id);
  updatedCount++;
      } else {
  const id = uid("c");
  const base: Contact = { id, email, name, phone, type: tab };
        if (tab === "students") {
          toAdd.push({ ...base, firstName: name?.split(" ")[0] || r.firstName || r["First Name"], jobTitle: r.jobTitle || r["Job Title"], skills: parseSkills((r.skills as string) || (r.Skills as string)), location: r.location || r.Location });
        } else {
          toAdd.push({ ...base, companyName: r.companyName || r["Company Name"], jobTitle: r.jobTitle || r["Job Title"] });
        }
  linkIds.push(id);
  added++;
      }
    });

    // Build final DB state atomically
  const contactsWithUpdates: Contact[] = db.contacts.map(c => updatedMap.get(c.id) ?? c);
  const finalContacts: Contact[] = [...toAdd, ...contactsWithUpdates];
    const uniqueIds = Array.from(new Set([...
      linkIds,
      ...list.contactIds
    ]));
  const finalList = { ...list, contactIds: uniqueIds };
    const finalLists = db.lists.map(l => l.id === finalList.id ? finalList : l);
  setDb({ ...db, contacts: finalContacts, lists: finalLists });
  setImportSummary(`Imported ${rows.length} rows → added ${added}, updated ${updatedCount}, skipped ${skipped}`);
  }

  function onAddOne(c: { name?: string; phone?: string; email: string }) {
    if (!list) return;
    const id = uid("c");
  const base: Contact = { id, email: c.email.trim(), name: c.name?.trim(), phone: c.phone?.trim(), type: tab };
    if (!base.email) return;
    if (tab === "students") {
      addContact(db, setDb, { ...base, firstName: base.name?.split(" ")[0] });
    } else {
      addContact(db, setDb, { ...base, companyName: base.name });
    }
    upsertList(db, setDb, { ...list, contactIds: [id, ...list.contactIds] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="flex gap-2">
          <button onClick={addSample} className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm text-white">Add Sample</button>
          <CsvImport onImport={onImport} templateHeaders={tab==='students' ? ["email","name","phone","jobTitle","skills","location"] : ["email","name","phone","companyName","jobTitle"]} />
        </div>
      </div>

      <div className="flex gap-2">
  <button onClick={()=>setTab("students")} className={`rounded-md px-3 py-2 text-sm ${tab==='students'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Students</button>
  <button onClick={()=>setTab("employers")} className={`rounded-md px-3 py-2 text-sm ${tab==='employers'?"bg-[var(--ts-primary)] text-white":"border border-[var(--border)] bg-[var(--card)]"}`}>Employers</button>
      </div>

      {importSummary && (
        <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 text-sm">{importSummary}</div>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        {filters.map((f)=> (
          <input key={f} placeholder={f} className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        ))}
      </div>

  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="text-sm font-medium mb-2">Add one contact</div>
        <AddContactForm onAdd={onAddOne} />
      </div>

  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
  <div className="mb-2 text-[var(--muted-foreground)]">List: {list?.name} • {list?.contactIds.length ?? 0} contacts</div>
  <ul className="divide-y divide-[var(--border)]">
          {db.contacts.filter(c=>c.type===tab && (list?.contactIds ?? []).includes(c.id)).map(c => (
            <li key={c.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name ?? c.firstName ?? c.companyName ?? c.email}</div>
                <div className="text-[var(--muted-foreground)]">{c.email}{c.phone ? ` • ${c.phone}` : ""}</div>
              </div>
              <span className="rounded-full bg-[var(--ts-primary)]/10 px-2 py-1 text-[11px] font-medium text-[var(--ts-primary)]">{c.type}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

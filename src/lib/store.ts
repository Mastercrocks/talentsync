"use client";
import { useEffect, useState } from "react";
import { Automation, Campaign, Contact, EmailTemplate, List } from "./types";
import { builtinTemplates } from "./templates";

type DB = {
  contacts: Contact[];
  lists: List[];
  campaigns: Campaign[];
  templates: EmailTemplate[];
  automations: Automation[];
  updatedAt?: number;
};

const KEY = "tsync-db-v1";

function migrate(db: DB): DB {
  // Ensure builtin templates exist and are up to date; remove old employer template id
  const withoutOldEmployer = db.templates.filter(t => t.id !== "tpl_employer_free");
  // Replace or insert current builtin templates by id to refresh content
  const byId = new Map<string, EmailTemplate>(withoutOldEmployer.map(t => [t.id, t]));
  for (const bt of builtinTemplates) {
    byId.set(bt.id, bt);
  }
  return { ...db, templates: Array.from(byId.values()) };
}

function loadLocal(): DB {
  if (typeof window === "undefined") return { contacts: [], lists: [], campaigns: [], templates: [], automations: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
    // seed defaults
    const seeded: DB = {
      contacts: [],
      lists: [
        { id: "list_students", name: "Students", type: "students", contactIds: [] },
        { id: "list_employers", name: "Employers", type: "employers", contactIds: [] },
      ],
      campaigns: [],
      templates: builtinTemplates,
      automations: [],
    };
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return migrate(seeded);
  } catch {
    return { contacts: [], lists: [], campaigns: [], templates: [], automations: [] };
  }
}

function saveLocal(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function useDB() {
  const [db, setDb] = useState<DB>({ contacts: [], lists: [], campaigns: [], templates: [], automations: [] });
  // Initial load: try server DB first, fallback to local
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/db", { cache: "no-store" });
        if (res.ok) {
          const server = (await res.json()) as DB;
          if (!cancelled) {
            const local = loadLocal();
            // prefer the one with newer updatedAt or with more contacts if ts missing
            const serverScore = server.updatedAt ?? 0;
            const localScore = local.updatedAt ?? 0;
            const pick = serverScore === 0 && localScore === 0
              ? (server.contacts?.length || 0) >= (local.contacts?.length || 0) ? server : local
              : (serverScore >= localScore ? server : local);
            setDb(migrate(pick));
            return;
          }
        }
      } catch {}
      if (!cancelled) setDb(loadLocal());
    })();
    return () => { cancelled = true; };
  }, []);
  // Persist locally and mirror to server on any change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const withTs = { ...db, updatedAt: Date.now() } as DB;
    saveLocal(withTs);
    // fire-and-forget server sync
    fetch("/api/db", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(withTs) })
      .catch(() => {});
  }, [db]);
  return [db, setDb] as const;
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// helpers
export function addCampaign(db: DB, setDb: (db: DB) => void, c: Campaign) {
  setDb({ ...db, campaigns: [c, ...db.campaigns] });
}
export function addAutomation(db: DB, setDb: (db: DB) => void, a: Automation) {
  setDb({ ...db, automations: [a, ...db.automations] });
}
export function upsertList(db: DB, setDb: (db: DB) => void, list: List) {
  const lists = db.lists.some(l => l.id === list.id) ? db.lists.map(l => l.id === list.id ? list : l) : [list, ...db.lists];
  setDb({ ...db, lists });
}
export function addContact(db: DB, setDb: (db: DB) => void, contact: Contact) {
  setDb({ ...db, contacts: [contact, ...db.contacts] });
}

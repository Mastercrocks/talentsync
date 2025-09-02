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
};

const KEY = "tsync-db-v1";

function load(): DB {
  if (typeof window === "undefined") return { contacts: [], lists: [], campaigns: [], templates: [], automations: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
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
    return seeded;
  } catch {
    return { contacts: [], lists: [], campaigns: [], templates: [], automations: [] };
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function useDB() {
  const [db, setDb] = useState<DB>({ contacts: [], lists: [], campaigns: [], templates: [], automations: [] });
  useEffect(() => { setDb(load()); }, []);
  useEffect(() => { save(db); }, [db]);
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

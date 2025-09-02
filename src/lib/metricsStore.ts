import { promises as fs } from "fs";
import path from "path";

export type CampaignMetrics = {
  sends: number;
  opens: number;
  clicks: number;
  links: Record<string, number>;
  recipients: Record<string, { opens: number; clicks: number }>;
};

type Store = Record<string, CampaignMetrics>;

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "metrics.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE); } catch { await fs.writeFile(FILE, "{}", "utf8"); }
}

export async function readStore(): Promise<Store> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try { return JSON.parse(raw) as Store; } catch { return {}; }
}

async function writeStore(store: Store) {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(store), "utf8");
}

function initMetrics(): CampaignMetrics {
  return { sends: 0, opens: 0, clicks: 0, links: {}, recipients: {} };
}

export async function incrSends(campaignId: string, recipientIds: string[]) {
  const st = await readStore();
  const m = st[campaignId] || initMetrics();
  m.sends += recipientIds.length;
  for (const id of recipientIds) {
    m.recipients[id] = m.recipients[id] || { opens: 0, clicks: 0 };
  }
  st[campaignId] = m;
  await writeStore(st);
}

export async function incrOpen(campaignId: string, contactId: string) {
  const st = await readStore();
  const m = st[campaignId] || initMetrics();
  m.opens += 1;
  m.recipients[contactId] = m.recipients[contactId] || { opens: 0, clicks: 0 };
  m.recipients[contactId].opens += 1;
  st[campaignId] = m;
  await writeStore(st);
}

export async function incrClick(campaignId: string, contactId: string, url: string) {
  const st = await readStore();
  const m = st[campaignId] || initMetrics();
  m.clicks += 1;
  m.links[url] = (m.links[url] || 0) + 1;
  m.recipients[contactId] = m.recipients[contactId] || { opens: 0, clicks: 0 };
  m.recipients[contactId].clicks += 1;
  st[campaignId] = m;
  await writeStore(st);
}

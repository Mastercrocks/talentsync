"use client";
import { useMemo, useState } from "react";
import { useDB } from "@/lib/store";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [db] = useDB();
  const [roiRate, setRoiRate] = useState<number>(0); // optional override per conversion value

  const labels = db.campaigns.map(c => c.name);
  const openData = db.campaigns.map(c => (c.metrics?.sends ? Math.round((100 * (c.metrics.opens ?? 0)) / c.metrics.sends) : 0));
  // const clickData = db.campaigns.map(c => (c.metrics?.sends ? Math.round((100 * (c.metrics.clicks ?? 0)) / c.metrics.sends) : 0));
  const convData = db.campaigns.map(c => (c.metrics?.sends ? Math.round((100 * (c.metrics.conversions ?? 0)) / c.metrics.sends) : 0));

  const revenue = db.campaigns.reduce((a, c) => a + (c.metrics?.revenue ?? 0), 0);
  const cost = db.campaigns.reduce((a, c) => a + (c.metrics?.cost ?? 0), 0);
  const calcRoi = useMemo(() => {
    if (revenue || cost) return cost ? Math.round(((revenue - cost) / cost) * 100) : 0;
    // If no cost/revenue provided, estimate by conversion count * roiRate
    const conversions = db.campaigns.reduce((a, c) => a + (c.metrics?.conversions ?? 0), 0);
    const estRev = conversions * (roiRate || 0);
    return cost ? Math.round(((estRev - cost) / cost) * 100) : 0;
  }, [revenue, cost, db.campaigns, roiRate]);

  const clicksByUrl = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of db.campaigns) {
      for (const l of c.metrics?.links ?? []) {
        map.set(l.url, (map.get(l.url) ?? 0) + l.count);
      }
    }
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 10);
  }, [db.campaigns]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-sm font-medium mb-2">Open rate by campaign</div>
          <div className="h-64">
            {db.campaigns.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">No data yet.</div>
            ) : (
              <Line data={{ labels, datasets: [{ label: "Open %", data: openData, borderColor: "#2563EB" }] }} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-sm font-medium mb-2">Clicks by URL</div>
          {clicksByUrl.length === 0 ? (
            <div className="text-sm text-[var(--muted-foreground)]">No click data.</div>
          ) : (
            <ul className="text-sm divide-y divide-[var(--border)]">
              {clicksByUrl.map(([u, n]) => (
                <li key={u} className="py-2 flex items-center justify-between"><span className="truncate max-w-[70%]" title={u}>{u}</span><span className="text-[var(--muted-foreground)]">{n}</span></li>
              ))}
            </ul>
          )}
        </div>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-sm font-medium mb-2">Conversion from email to job application</div>
          <div className="h-64">
            {db.campaigns.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">No data yet.</div>
            ) : (
              <Line data={{ labels, datasets: [{ label: "Conversion %", data: convData, borderColor: "#16a34a" }] }} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <div className="text-sm font-medium">ROI Calculator</div>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            <div className="rounded-md border border-[var(--border)] p-2">Revenue: {revenue.toLocaleString()}</div>
            <div className="rounded-md border border-[var(--border)] p-2">Cost: {cost.toLocaleString()}</div>
            <label className="sm:col-span-2">
              <div className="mb-1">Estimated value per conversion (optional)</div>
              <input type="number" className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] p-2" value={roiRate} onChange={e=>setRoiRate(Number(e.target.value)||0)} />
            </label>
          </div>
          <div className="rounded-md border border-[var(--border)] p-2 text-sm">ROI: {calcRoi}%</div>
        </div>
      </div>
    </div>
  );
}

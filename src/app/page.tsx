"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useMemo } from "react";
import { useDB } from "@/lib/store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Home() {
  const [db, setDb] = useDB();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/metrics", { cache: "no-store" });
        const st = await res.json();
        // Merge metrics by campaign id (best-effort)
        const next = db.campaigns.map(c => {
          const m = st[c.id];
          if (!m) return c;
          return { ...c, metrics: { sends: Number(m.sends)||0, opens: Number(m.opens)||0, clicks: Number(m.clicks)||0, conversions: c.metrics?.conversions ?? 0, links: Object.entries(m.links).map(([url, count]) => ({ url, count: Number(count)||0 })) } };
        });
        if (JSON.stringify(next) !== JSON.stringify(db.campaigns)) {
          setDb({ ...db, campaigns: next });
        }
      } catch {}
    })();
  }, [db, setDb]);
  const campaigns = db.campaigns.slice(0, 7);
  const totals = useMemo(() => {
    const sent = campaigns.reduce((a, c) => a + (c.metrics?.sends ?? 0), 0);
    const opens = campaigns.reduce((a, c) => a + (c.metrics?.opens ?? 0), 0);
    const clicks = campaigns.reduce((a, c) => a + (c.metrics?.clicks ?? 0), 0);
    const openRate = sent ? Math.round((opens / sent) * 100) : 0;
    const ctr = sent ? Math.round((clicks / sent) * 100) : 0;
    return { sent, openRate, ctr };
  }, [campaigns]);

  const data = useMemo(() => ({
    labels: campaigns.map((c) => c.name),
    datasets: [
      { label: "Open %", data: campaigns.map((c) => (c.metrics?.sends ? Math.round((100 * (c.metrics?.opens ?? 0)) / c.metrics.sends) : 0)), borderColor: "#2563EB", backgroundColor: "rgba(37,99,235,0.2)" },
      { label: "Click %", data: campaigns.map((c) => (c.metrics?.sends ? Math.round((100 * (c.metrics?.clicks ?? 0)) / c.metrics.sends) : 0)), borderColor: "#93c5fd", backgroundColor: "rgba(147,197,253,0.2)" },
    ],
  }), [campaigns]);

  const scheduled = db.campaigns.filter(c => c.status === "scheduled");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Emails Sent", value: totals.sent.toLocaleString() },
          { label: "Open Rate", value: `${totals.openRate}%` },
          { label: "Click-Through Rate", value: `${totals.ctr}%` },
          { label: "Campaigns", value: db.campaigns.length.toString() },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-sm text-[var(--muted-foreground)]">{c.label}</div>
            <div className="mt-2 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Campaign Performance</h2>
          </div>
          <div className="h-64">
            {campaigns.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">No data yet — create a campaign to see performance.</div>
            ) : (
              <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="text-lg font-medium">Top Performing Campaign</h2>
          {campaigns.length === 0 ? (
            <div className="mt-4 text-sm text-[var(--muted-foreground)]">No campaigns yet.</div>
          ) : (
            (() => {
              const ranked = campaigns
                .map(c => ({ c, rate: c.metrics?.sends ? (c.metrics.opens ?? 0) / c.metrics.sends : 0 }))
                .sort((a,b)=>b.rate-a.rate);
              const top = ranked[0];
              return (
                <div className="mt-3 text-sm">
                  <div className="font-medium">{top.c.name}</div>
                  <div className="text-[var(--muted-foreground)]">Open Rate: {Math.round((top.rate||0)*100)}% • Sent: {top.c.metrics?.sends ?? 0}</div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-lg font-medium">Upcoming Scheduled Emails</h2>
        {scheduled.length === 0 ? (
          <div className="mt-3 text-sm text-[var(--muted-foreground)]">Nothing scheduled.</div>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)]">
            {scheduled.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-[var(--muted-foreground)]">{i.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : "TBD"}</div>
                </div>
                <span className="rounded-full bg-[var(--ts-primary)]/10 px-2 py-1 text-[11px] font-medium text-[var(--ts-primary)]">{i.status ?? 'scheduled'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

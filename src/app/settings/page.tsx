"use client";
import { useEffect, useRef, useState } from "react";
import { useDB } from "@/lib/store";

export default function SettingsPage() {
  const [db, setDb] = useDB();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<null | { activeMode: string; from: string; smtp: { enabled: boolean; host: string|null; user: string|null; from: string|null }; resend: { enabled: boolean; from: string } }>(null);
  const [testTo, setTestTo] = useState<string>("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/email/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setEmailStatus(data);
        }
      } catch {}
    })();
  }, []);

  function downloadBackup() {
    const json = JSON.stringify(db, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talentsync-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup downloaded.");
  }

  async function restoreFromFile(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // minimal validation
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file');
      for (const k of ["contacts","lists","campaigns","templates","automations"]) {
        if (!Array.isArray(parsed[k])) throw new Error(`Missing or invalid ${k}`);
      }
      setDb(parsed);
      setMsg("Backup restored and saved.");
    } catch (e) {
      setMsg((e as Error).message || "Restore failed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      {msg && <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 text-sm">{msg}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">API Integrations (LinkedIn, Payment)</div>
        <div className="rounded-lg border border-border bg-card p-4">Role-Based Access Control</div>
        <div className="rounded-lg border border-border bg-card p-4">GDPR / Unsubscribe Management</div>
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="font-medium">Email delivery</div>
          <div className="text-sm text-[var(--muted-foreground)]">
            {emailStatus ? (
              <>
                <div>Mode: <span className="font-medium">{emailStatus.activeMode}</span></div>
                <div>From: <span className="font-mono">{emailStatus.from}</span></div>
                {emailStatus.smtp.enabled && (
                  <div className="mt-1 text-xs">SMTP: {emailStatus.smtp.host} as {emailStatus.smtp.user}</div>
                )}
              </>
            ) : (
              <span>Detecting configuration…</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <input
              value={testTo}
              onChange={(e)=>setTestTo(e.target.value)}
              placeholder="your@email.com"
              className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2"
              type="email"
            />
            <button
              onClick={async ()=>{
                setTesting(true); setTestResult(null);
                try {
                  const res = await fetch("/api/email/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: testTo }) });
                  const data = await res.json();
                  if (res.ok && data.ok) setTestResult("Sent. Check your inbox (and spam)." );
                  else setTestResult(data.error || "Failed to send");
                } catch (e) {
                  setTestResult((e as Error).message);
                } finally { setTesting(false); }
              }}
              disabled={!testTo || testing}
              className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-white disabled:opacity-60"
            >{testing?"Sending…":"Send test email"}</button>
          </div>
          {testResult && <div className="text-xs text-[var(--muted-foreground)]">{testResult}</div>}
        </div>
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="font-medium">Data Backup</div>
          <p className="text-sm text-[var(--muted-foreground)]">Your data is saved in your browser. Use backup if you switch devices or dev ports.</p>
          <div className="flex gap-2 text-sm">
            <button onClick={downloadBackup} className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-white">Download Backup</button>
            <button onClick={()=>fileRef.current?.click()} className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2">Restore Backup</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if (f) restoreFromFile(f); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

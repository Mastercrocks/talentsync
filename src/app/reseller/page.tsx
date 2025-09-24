import Link from "next/link";

export default function ResellerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reseller Dashboard (placeholder)</h1>
          <div className="text-sm text-[var(--muted-foreground)]">Upload a new prompt to replace this page.</div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-[var(--ts-primary)]">Switch to TalentSync</Link>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm">This placeholder remains while you provide the new dashboard prompt. I removed the previous implementation as requested.</p>
      </div>
    </div>
  );
}

export default function RootLoading() {
  return (
  <div className="min-h-screen grid place-items-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center gap-3">
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ts-primary)] border-t-transparent"></div>
  <span className="text-sm text-[var(--muted-foreground)]">Loading…</span>
      </div>
    </div>
  );
}

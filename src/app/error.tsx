"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to console for debugging
    // In a real app, send to monitoring here
  console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] grid place-items-center bg-[var(--background)] text-[var(--foreground)] p-6">
      <div className="max-w-xl w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">An unexpected error occurred. Try again or reload.</p>
        <pre className="mt-3 whitespace-pre-wrap rounded-md bg-[var(--muted)] p-3 text-xs overflow-auto">{error.message}</pre>
        <button onClick={() => reset()} className="mt-4 rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm text-white">Try again</button>
      </div>
    </div>
  );
}

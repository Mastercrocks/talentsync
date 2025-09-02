"use client";
import Papa, { ParseResult } from "papaparse";
import { useRef, useState } from "react";

export type CsvRow = Record<string, string>;

export default function CsvImport({ onImport, templateHeaders }: { onImport: (rows: CsvRow[]) => void; templateHeaders: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  function openFile() { inputRef.current?.click(); }

  function handleFile(file: File) {
    setError(null);
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: ParseResult<CsvRow>) => {
        if (res.errors?.length) {
          setError(res.errors[0].message);
        }
        const data = (res.data || []).filter(Boolean);
        setRows(data);
        // Auto-import immediately after parsing
        if (data.length) {
          try {
            onImport(data);
          } catch (e) {
            console.error(e);
          }
        }
      },
  error: (err: unknown) => setError((err as Error)?.message ?? "Parse error"),
    });
  }

  function downloadTemplate() {
    const csv = templateHeaders.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handleFile(f); }} />
      <div className="flex gap-2">
  <button onClick={openFile} className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">Choose CSV</button>
  <button onClick={downloadTemplate} className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">Download Template</button>
  <button disabled={!rows.length} onClick={()=>onImport(rows)} className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm text-white disabled:opacity-50">Import {rows.length ? `(${rows.length})` : ""}</button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      {rows.length>0 && (
  <div className="rounded-md border border-[var(--border)] overflow-auto max-h-48">
          <table className="w-full text-xs">
            <thead className="bg-[var(--muted)] sticky top-0">
              <tr>{Object.keys(rows[0]).map(h=> <th key={h} className="text-left p-2 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(0,20).map((r,i)=> (
                <tr key={i} className="border-t border-[var(--border)]">
                  {Object.keys(rows[0]).map(h=> <td key={h} className="p-2">{r[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

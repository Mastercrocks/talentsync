"use client";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";

type Block = { id: string; type: "header"|"text"|"image"|"button"|"divider"; content?: string };

export default function EmailBuilderPage() {
  const [blocks] = useState<Block[]>([
    { id: "b1", type: "header", content: "Welcome to TalentSync" },
    { id: "b2", type: "text", content: "Hi [First Name], check out new roles for [Job Title] at [Company Name]." },
  ]);
  const [ab, setAb] = useState(false);

  function onDragEnd() {
    // TODO: implement reordering using @dnd-kit/sortable
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaign Builder</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={ab} onChange={e=>setAb(e.target.checked)} /> A/B Test Subject</label>
          <button className="rounded-md border border-border bg-card px-3 py-2 text-sm">Preview</button>
          <button className="rounded-md bg-[var(--ts-primary)] px-3 py-2 text-sm text-white">Test Send</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-2">Templates</h3>
          <ul className="text-sm space-y-2">
            <li>Job Alerts</li>
            <li>Employer Promotions</li>
            <li>Newsletters</li>
          </ul>
          <h3 className="font-medium mt-4 mb-2">Blocks</h3>
          <ul className="text-sm space-y-2">
            <li>Header</li>
            <li>Text</li>
            <li>Image</li>
            <li>Button</li>
            <li>Divider</li>
          </ul>
          <h3 className="font-medium mt-4 mb-2">Personalization</h3>
          <div className="text-xs grid grid-cols-2 gap-2">
            <code>[First Name]</code>
            <code>[Company Name]</code>
            <code>[Job Title]</code>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
          <DndContext onDragEnd={onDragEnd}>
            <div className="space-y-3">
              {blocks.map((b) => (
                <div key={b.id} className="rounded-md border border-border p-3">
                  <div className="text-xs uppercase text-muted-foreground">{b.type}</div>
                  <div className="mt-1 text-sm whitespace-pre-wrap">{b.content}</div>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

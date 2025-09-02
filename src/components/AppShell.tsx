"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
  <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar onToggleSidebar={() => setOpen((v) => !v)} />
      <div className="flex">
        <Sidebar open={open} />
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all ${open ? "ml-0" : "ml-0"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

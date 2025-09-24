"use client";
import Link from "next/link";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import ThemeToggle from "./ThemeToggle";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/reseller", label: "Reseller" },
  { href: "/campaigns", label: "Email Campaigns" },
  { href: "/contacts", label: "Contacts" },
  { href: "/analytics", label: "Analytics" },
  { href: "/automation", label: "Automation" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
  <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
  <button onClick={onToggleSidebar} className="md:hidden rounded-md p-2 hover:bg-[var(--muted)]">
            <Bars3Icon className="h-6 w-6" />
          </button>
  <Link href="/" className="text-lg font-semibold text-[var(--ts-primary)]">
            TalentSync
          </Link>
          <nav className="ml-6 hidden gap-4 md:flex">
      {nav.map((n) => (
    <Link key={n.href} href={n.href} className="text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)]">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
              <span className="h-6 w-6 rounded-full bg-[var(--ts-primary)] text-white grid place-items-center text-[10px]">TS</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-[var(--border)] bg-[var(--card)] shadow-lg focus:outline-none">
              <div className="p-1 text-sm">
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/settings" className={`block rounded px-2 py-1 ${active ? 'bg-[var(--muted)]' : ''}`}>Account Settings</Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`w-full text-left block rounded px-2 py-1 ${active ? 'bg-[var(--muted)]' : ''}`}>Logout</button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBarIcon, Cog6ToothIcon, EnvelopeIcon, HomeIcon, UserGroupIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const items = [
  { href: "/", label: "Dashboard Overview", icon: HomeIcon },
  { href: "/campaigns", label: "Email Campaigns", icon: EnvelopeIcon },
  { href: "/contacts", label: "Contact Lists", icon: UserGroupIcon },
  { href: "/automation", label: "Automation Workflows", icon: ArrowPathIcon },
  { href: "/analytics", label: "Reports & Analytics", icon: ChartBarIcon },
  { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  return (
  <aside className={`border-r border-[var(--border)] bg-[var(--card)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/40 ${open ? "w-64" : "w-0 md:w-64"} transition-[width] duration-300 overflow-hidden sticky top-[57px] h-[calc(100vh-57px)] hidden md:block`}>
      <nav className="p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
  <Link key={href} href={href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm mb-1 border border-transparent ${active ? "bg-[var(--ts-primary)] text-white" : "hover:bg-[var(--muted)]"}`}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users & Roles" },
  { href: "/admin/hospitals", label: "Hospital Moderation" },
  { href: "/admin/reviews", label: "Review Moderation" },
  { href: "/admin/finance", label: "Finance" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "Platform Settings" },
];

export function AdminSidebar() {
  // Strip the locale prefix so active-state comparisons match the unprefixed nav hrefs.
  const pathname = usePathname().replace(/^\/(en|bn)(?=\/|$)/, "") || "/";

  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-300/70 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col gap-1 overflow-y-auto p-4">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2 font-bold text-neutral-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs text-white">
            AHL
          </span>
          Admin Console
        </Link>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-primary-100 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

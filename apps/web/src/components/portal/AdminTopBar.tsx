import Link from "next/link";
import { currentAdmin, hospitalModerationQueue, pendingReviews } from "@/data/admin";

const mobileNavItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/finance", label: "Finance" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminTopBar() {
  const pendingCount = hospitalModerationQueue.length + pendingReviews.length;

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">Platform Administration</p>
          <p className="text-xs text-neutral-500">
            {currentAdmin.name} &middot; {currentAdmin.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden rounded-full bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-600 sm:inline-block">
            Demo mode — sample data
          </span>
          {pendingCount > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-info-100 px-2.5 py-1 text-xs font-semibold text-info-600">
              {pendingCount} pending moderation
            </span>
          ) : null}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {currentAdmin.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-300/70 px-3 py-2 lg:hidden">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-primary-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/cases", label: "My Applications" },
  { href: "/app/apply", label: "New Application" },
  { href: "/app/dependents", label: "My Dependents" },
  { href: "/app/bookings/hotels", label: "Hotel Bookings" },
  { href: "/app/bookings/transfers", label: "Airport Transfers" },
  { href: "/app/payments", label: "Payments" },
  { href: "/app/reviews", label: "Reviews" },
  { href: "/app/notifications", label: "Notifications" },
  { href: "/app/settings", label: "Settings" },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-300/70 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col gap-1 overflow-y-auto p-4">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2 font-bold text-neutral-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs text-white">
            AH
          </span>
          Patient Portal
        </Link>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app/dashboard" && pathname.startsWith(item.href));
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

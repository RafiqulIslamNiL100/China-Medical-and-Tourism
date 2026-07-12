import Link from "next/link";
import { currentPatient, patientNotifications } from "@/data/patient";

const mobileNavItems = [
  { href: "/app/dashboard", label: "Home" },
  { href: "/app/cases", label: "Cases" },
  { href: "/app/payments", label: "Payments" },
  { href: "/app/dependents", label: "Dependents" },
  { href: "/app/bookings/hotels", label: "Hotels" },
  { href: "/app/bookings/transfers", label: "Transfers" },
  { href: "/app/reviews", label: "Reviews" },
  { href: "/app/settings", label: "Settings" },
];

export function PortalTopBar() {
  const unreadCount = patientNotifications.filter((n) => !n.read).length;

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs text-white">
            CMT
          </span>
        </Link>
        <span className="hidden rounded-full bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-600 lg:inline-block">
          Demo mode — sample data, no real account
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/app/notifications"
            className="relative rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 8a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 20a2.5 2.5 0 005 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/app/settings"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700"
          >
            {currentPatient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Link>
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

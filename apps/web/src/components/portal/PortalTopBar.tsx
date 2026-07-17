"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { useLocale } from "@/lib/i18n";
import { listNotifications, getMyPatientProfile } from "@/lib/api";

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
  const router = useRouter();
  const locale = useLocale();
  const { accessToken, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [initials, setInitials] = useState("··");

  useEffect(() => {
    if (!accessToken) return;
    listNotifications(accessToken, true)
      .then((res) => setUnreadCount(res.data.length))
      .catch(() => setUnreadCount(0));
    getMyPatientProfile(accessToken)
      .then((profile) =>
        setInitials(
          profile.fullName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join(""),
        ),
      )
      .catch(() => setInitials("?"));
  }, [accessToken]);

  function handleLogout() {
    logout();
    router.push(`/${locale}/login`);
  }

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs text-white">
            AHL
          </span>
        </Link>
        <span className="hidden lg:inline-block" />
        <div className="flex items-center gap-3">
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
            {initials}
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md px-2 py-1.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Log out
          </button>
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

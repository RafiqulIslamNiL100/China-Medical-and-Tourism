"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { listModerationQueue, listPendingReviews } from "@/lib/api";

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
  const router = useRouter();
  const { accessToken, user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([listModerationQueue(accessToken), listPendingReviews(accessToken)]).then(([mod, reviews]) =>
      setPendingCount(mod.length + reviews.length),
    );
  }, [accessToken]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">Platform Administration</p>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {pendingCount > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-info-100 px-2.5 py-1 text-xs font-semibold text-info-600">
              {pendingCount} pending moderation
            </span>
          ) : null}
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

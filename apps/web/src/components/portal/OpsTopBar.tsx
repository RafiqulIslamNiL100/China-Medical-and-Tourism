"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { listApplications } from "@/lib/api";
import { slaRiskFor } from "@/lib/portal";

const mobileNavItems = [
  { href: "/ops/queue", label: "Case Queue" },
  { href: "/ops/assignments", label: "Assignments" },
];

export function OpsTopBar() {
  const router = useRouter();
  const { accessToken, user, logout } = useAuth();
  const [urgentCount, setUrgentCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    listApplications(accessToken).then((res) =>
      setUrgentCount(res.data.filter((a) => slaRiskFor(a.submittedAt, a.status) === "breached").length),
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
          <p className="text-sm font-bold text-neutral-900">Operations Console</p>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {urgentCount > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-danger-100 px-2.5 py-1 text-xs font-semibold text-danger-600">
              {urgentCount} SLA breached
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

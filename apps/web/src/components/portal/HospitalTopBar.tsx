"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { useLocale } from "@/lib/i18n";
import { getMyHospital, listApplications } from "@/lib/api";

const mobileNavItems = [
  { href: "/hospital/dashboard", label: "Dashboard" },
  { href: "/hospital/applications", label: "Applications" },
  { href: "/hospital/profile", label: "Profile" },
  { href: "/hospital/doctors", label: "Doctors" },
  { href: "/hospital/packages", label: "Packages" },
  { href: "/hospital/reports", label: "Reports" },
];

export function HospitalTopBar() {
  const router = useRouter();
  const locale = useLocale();
  const { accessToken, user, logout } = useAuth();
  const [hospitalName, setHospitalName] = useState("");
  const [staffTitle, setStaffTitle] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken).then((h) => {
      setHospitalName(h.name);
      setStaffTitle(h.staffTitle ?? "");
    });
    listApplications(accessToken).then((res) =>
      setPendingCount(res.data.filter((a) => a.status === "Submitted" || a.status === "UnderReview").length),
    );
  }, [accessToken]);

  function handleLogout() {
    logout();
    router.push(`/${locale}/login`);
  }

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">{hospitalName || "Hospital Portal"}</p>
          <p className="text-xs text-neutral-500">
            {user?.email}
            {staffTitle ? ` · ${staffTitle}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/hospital/applications"
            className="relative rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
            aria-label="Pending applications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 8a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9.5 20a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {pendingCount > 0 ? (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            ) : null}
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

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { useLocale } from "@/lib/i18n";
import type { Role } from "@/lib/api";

/**
 * Client-side gate for portal routes: waits for the stored session to load,
 * redirects anonymous visitors to /login, and shows a clear message when the
 * logged-in account's role doesn't match the portal. (The API enforces the same
 * rules server-side — this is UX, not the security boundary.)
 */
export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push(`/${locale}/login`);
  }, [loading, user, router, locale]);

  if (loading || !user) {
    return <p className="p-8 text-sm text-neutral-500">Loading…</p>;
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="p-8">
        <p className="font-semibold text-neutral-900">This portal is for {roles.join("/")} accounts.</p>
        <p className="mt-1 text-sm text-neutral-500">
          You are signed in as <span className="font-semibold">{user.email}</span> ({user.role}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

/** Where to land a user right after login, based on their role. */
export function roleHomePath(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "hospital_staff":
      return "/hospital/dashboard";
    case "case_manager":
      return "/ops/queue";
    case "driver":
      return "/partner/driver/trips";
    case "hotel_partner":
      return "/partner/hotel/dashboard";
    case "interpreter":
      return "/partner/interpreter/appointments";
    case "patient":
    default:
      return "/app/dashboard";
  }
}

// Re-exported for existing portal-page call sites (import { fmtDate } from
// "@/lib/portal") — the actual implementations live in lib/format.ts, a plain
// module with no "use client" directive, so they can also be called directly
// from Server Components (marketing pages), which importing them from this
// client-tainted file would not allow.
export { fmtDate, fmtDateTime, fmtMoney, statusLabel, slaRiskFor } from "./format";

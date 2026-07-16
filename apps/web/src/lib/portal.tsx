"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import type { Role } from "@/lib/api";

/**
 * Client-side gate for portal routes: waits for the stored session to load,
 * redirects anonymous visitors to /login, and shows a clear message when the
 * logged-in account's role doesn't match the portal. (The API enforces the same
 * rules server-side — this is UX, not the security boundary.)
 */
export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

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

export function fmtDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtMoney(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `$${Number(value).toLocaleString()}`;
}

/** API CaseStatus ("UnderReview") → display label ("Under Review"). */
export function statusLabel(status: string): string {
  return status.replace(/([a-z])([A-Z])/g, "$1 $2");
}

const OPEN_CASE_STATUSES = new Set(["Submitted", "UnderReview", "InfoRequested"]);

/** SLA target: respond within 3 business days of submission (approximated as calendar days). */
export function slaRiskFor(submittedAt: string, status: string): "on-track" | "at-risk" | "breached" {
  if (!OPEN_CASE_STATUSES.has(status)) return "on-track";
  const daysOpen = (Date.now() - new Date(submittedAt).getTime()) / (24 * 60 * 60 * 1000);
  if (daysOpen >= 3) return "breached";
  if (daysOpen >= 2) return "at-risk";
  return "on-track";
}

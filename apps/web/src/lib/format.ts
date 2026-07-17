// Plain formatting helpers with no client dependency — safe to import from both
// Server Components (marketing pages) and Client Components (portal pages via
// lib/portal.tsx, which re-exports these). Keep this file directive-free; a
// "use client" module taints every export as client-only, which breaks calling
// these directly from a Server Component even though the functions themselves
// have no browser dependency.

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

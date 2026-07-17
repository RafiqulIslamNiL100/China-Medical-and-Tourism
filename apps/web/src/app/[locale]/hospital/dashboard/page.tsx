"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDate, slaRiskFor } from "@/lib/portal";
import { getMyHospital, getHospitalReports, listApplications, type Application } from "@/lib/api";

export default function HospitalDashboardPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<{ bookingsThisMonth: number; revenueThisMonthUsd: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken)
      .then(async (hospital) => {
        const [apps, reports] = await Promise.all([
          listApplications(accessToken),
          getHospitalReports(accessToken, hospital.id),
        ]);
        setApplications(apps.data);
        setSummary(reports);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  const needsResponse = applications.filter(
    (a) => a.status === "Submitted" || a.status === "UnderReview" || a.status === "InfoRequested",
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Bookings this month</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{summary?.bookingsThisMonth ?? 0}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Revenue this month</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            ${(summary?.revenueThisMonthUsd ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Applications needing response
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{needsResponse.length}</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-neutral-900">Applications needing your response</h2>
          <Link href="/hospital/applications" className="text-sm font-semibold text-primary-700">
            View all &rarr;
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {needsResponse.map((a) => (
            <Link
              key={a.id}
              href={`/hospital/applications/${a.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div>
                <p className="font-bold text-neutral-900">{a.refNumber}</p>
                <p className="text-sm text-neutral-500">
                  {a.specialtySlug} &middot; Submitted {fmtDate(a.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{statusLabel(a.status)}</Badge>
                <SlaChip risk={slaRiskFor(a.submittedAt, a.status)} />
              </div>
            </Link>
          ))}
          {needsResponse.length === 0 ? (
            <p className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              Nothing needs your response right now.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

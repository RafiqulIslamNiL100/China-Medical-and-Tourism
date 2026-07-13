"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { getMyHospital, getHospitalReports } from "@/lib/api";

type Reports = {
  bookingsThisMonth: number;
  revenueThisMonthUsd: number;
  conversionFunnel: { stage: string; count: number }[];
};

export default function HospitalReportsPage() {
  const { accessToken } = useAuth();
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken)
      .then(async (hospital) => setReports(await getHospitalReports(accessToken, hospital.id)))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (!reports) return <p className="text-sm text-neutral-500">No report data available.</p>;

  const maxCount = reports.conversionFunnel[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Reports</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Bookings</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{reports.bookingsThisMonth}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">${reports.revenueThisMonthUsd.toLocaleString()}</p>
        </div>
      </div>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Conversion funnel</h2>
        <div className="flex flex-col gap-3">
          {reports.conversionFunnel.map((stage) => (
            <div key={stage.stage}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-neutral-700">{stage.stage}</span>
                <span className="font-semibold text-neutral-900 tabular-nums">{stage.count}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-primary-600"
                  style={{ width: `${maxCount ? (stage.count / maxCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
          {reports.conversionFunnel.length === 0 ? <p className="text-sm text-neutral-500">No data yet.</p> : null}
        </div>
      </section>
    </div>
  );
}

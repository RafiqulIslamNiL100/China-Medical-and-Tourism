"use client";

import { useEffect, useState } from "react";
import { Stars } from "@/components/Stars";
import { useAuth } from "@/lib/auth-client";
import { statusLabel } from "@/lib/portal";
import { getAdminDashboard, searchHospitals, type PlatformAnalytics, type Hospital } from "@/lib/api";

export default function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [topHospitals, setTopHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([getAdminDashboard(accessToken), searchHospitals()])
      .then(([dashboard, hospitals]) => {
        setAnalytics(dashboard);
        setTopHospitals([...hospitals.data].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (!analytics) return <p className="text-sm text-neutral-500">No data available.</p>;

  const maxCount = analytics.conversionFunnel[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Platform Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Bookings</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">{analytics.bookingsThisMonth}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">
            ${analytics.revenueThisMonthUsd.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Active Cases</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">{analytics.activeCases}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">SLA Compliance</p>
          <p className="mt-1 text-2xl font-bold text-success-600 tabular-nums">
            {Math.round(analytics.slaComplianceRate * 100)}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-neutral-900">Conversion funnel</h2>
          <div className="flex flex-col gap-3">
            {analytics.conversionFunnel.map((stage) => (
              <div key={stage.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-neutral-700">{statusLabel(stage.stage)}</span>
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
          </div>
        </section>

        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-neutral-900">Top rated hospitals</h2>
          <div className="flex flex-col gap-3">
            {topHospitals.map((h) => (
              <div key={h.id} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{h.name}</p>
                  <Stars rating={Number(h.rating)} />
                </div>
                <p className="text-sm text-neutral-500 tabular-nums">{h.reviewCount} reviews</p>
              </div>
            ))}
            {topHospitals.length === 0 ? <p className="text-sm text-neutral-500">No hospitals yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

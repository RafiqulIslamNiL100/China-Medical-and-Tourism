import type { Metadata } from "next";
import { Stars } from "@/components/Stars";
import { platformKpis, conversionFunnel, hospitalLeaderboard } from "@/data/admin";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  const maxCount = conversionFunnel[0].count;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Platform Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Bookings</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">
            {platformKpis.bookingsThisMonth}
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">
            ${platformKpis.revenueThisMonthUsd.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Active Cases</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">
            {platformKpis.activeCases}
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">SLA Compliance</p>
          <p className="mt-1 text-2xl font-bold text-success-600 tabular-nums">
            {Math.round(platformKpis.slaComplianceRate * 100)}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-neutral-900">Conversion funnel</h2>
          <div className="flex flex-col gap-3">
            {conversionFunnel.map((stage) => (
              <div key={stage.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-neutral-700">{stage.stage}</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">{stage.count}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-primary-600"
                    style={{ width: `${(stage.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-neutral-900">Hospital performance</h2>
          <div className="flex flex-col gap-3">
            {hospitalLeaderboard.map((h) => (
              <div key={h.name} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{h.name}</p>
                  <Stars rating={h.rating} />
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-neutral-900 tabular-nums">{h.bookings} bookings</p>
                  <p className="text-neutral-500 tabular-nums">${h.revenueUsd.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

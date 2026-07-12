import type { Metadata } from "next";
import { hospitalReportSummary } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Reports" };

export default function HospitalReportsPage() {
  const { conversionFunnel } = hospitalReportSummary;
  const maxCount = conversionFunnel[0].count;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Reports</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Bookings</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {hospitalReportSummary.bookingsThisMonth}
          </p>
          <p className="text-xs text-neutral-500">
            vs {hospitalReportSummary.bookingsLastMonth} last month
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            ${hospitalReportSummary.revenueThisMonthUsd.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500">
            vs ${hospitalReportSummary.revenueLastMonthUsd.toLocaleString()} last month
          </p>
        </div>
      </div>

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
    </div>
  );
}

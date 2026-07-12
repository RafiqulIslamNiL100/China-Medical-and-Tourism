import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { incomingApplications, hospitalReportSummary } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Hospital Dashboard" };

export default function HospitalDashboardPage() {
  const needsResponse = incomingApplications.filter(
    (a) => a.status === "Submitted" || a.status === "Under Review" || a.status === "Info Requested"
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Bookings this month
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {hospitalReportSummary.bookingsThisMonth}
          </p>
          <p className="text-xs text-success-600">
            +{hospitalReportSummary.bookingsThisMonth - hospitalReportSummary.bookingsLastMonth} vs last month
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Revenue this month
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            ${hospitalReportSummary.revenueThisMonthUsd.toLocaleString()}
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
                <p className="font-bold text-neutral-900">{a.patientName}</p>
                <p className="text-sm text-neutral-500">
                  {a.specialty} &middot; {a.refNumber} &middot; Submitted {a.submittedDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{a.status}</Badge>
                <SlaChip risk={a.slaRisk} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { StatusChip } from "@/components/portal/StatusChip";
import { currentPatient, patientCases } from "@/data/patient";

export const metadata: Metadata = { title: "Dashboard" };

export default function PatientDashboardPage() {
  const activeCases = patientCases.filter((c) => c.status !== "Completed" && c.status !== "Declined");
  const caseNeedingAction = patientCases.find((c) => c.nextStep && c.status === "Accepted");
  const upcomingItinerary = patientCases.flatMap((c) => c.itinerary).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back, {currentPatient.name.split(" ")[0]}
        </h1>
        <p className="text-neutral-500">Here&apos;s what&apos;s happening across your cases.</p>
      </div>

      {caseNeedingAction ? (
        <div className="flex items-center justify-between gap-4 rounded-[10px] border border-warning-600/30 bg-warning-100 p-4">
          <div>
            <p className="text-sm font-bold text-neutral-900">Action needed</p>
            <p className="text-sm text-neutral-700">{caseNeedingAction.nextStep}</p>
          </div>
          <Button href={`/app/cases/${caseNeedingAction.id}`} size="sm" variant="accent">
            Resolve
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">Active applications</h2>
            <Link href="/app/cases" className="text-sm font-semibold text-primary-700">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {activeCases.map((c) => (
              <Link
                key={c.id}
                href={`/app/cases/${c.id}`}
                className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">{c.hospitalName}</span>
                  <StatusChip status={c.status} />
                </div>
                <p className="text-sm text-neutral-500">
                  {c.specialty} &middot; {c.refNumber}
                </p>
                <p className="text-sm text-neutral-700">{c.nextStep}</p>
              </Link>
            ))}
            {activeCases.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center">
                <p className="font-semibold text-neutral-900">No active applications</p>
                <Button href="/app/apply" className="mt-3">
                  Start your first application
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-bold text-neutral-900">Upcoming itinerary</h2>
          <div className="flex flex-col gap-3">
            {upcomingItinerary.length > 0 ? (
              upcomingItinerary.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold text-primary-700">{ev.type}</p>
                  <p className="text-sm font-bold text-neutral-900">{ev.title}</p>
                  <p className="text-xs text-neutral-500">{ev.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">Nothing scheduled yet.</p>
            )}
          </div>

          <h2 className="mt-6 mb-3 font-bold text-neutral-900">Quick links</h2>
          <div className="flex flex-col gap-2">
            <Button href="/app/apply" variant="secondary" className="justify-start">
              New Application
            </Button>
            <Button href="/app/dependents" variant="secondary" className="justify-start">
              Manage Dependents
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

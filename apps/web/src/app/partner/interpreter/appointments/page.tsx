import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SimplePartnerHeader } from "@/components/portal/SimplePartnerHeader";
import { currentInterpreter, interpreterAppointments } from "@/data/partner";

export const metadata: Metadata = { title: "My Appointments" };

export default function InterpreterAppointmentsPage() {
  const upcoming = interpreterAppointments.filter((a) => a.status === "Upcoming");

  return (
    <div className="flex min-h-full flex-col bg-neutral-100">
      <SimplePartnerHeader
        title="My Appointments"
        subtitle={`${currentInterpreter.name} · ${currentInterpreter.languages}`}
      />
      <main className="mx-auto w-full max-w-lg flex-1 p-4">
        <section>
          <h2 className="mb-3 font-bold text-neutral-900">Upcoming</h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((a) => (
              <div key={a.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge tone="primary">{a.department.split(" — ")[0]}</Badge>
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">
                    {a.date} &middot; {a.time}
                  </p>
                </div>
                <p className="mt-2 text-lg font-bold text-neutral-900">{a.patientName}</p>
                <p className="text-sm text-neutral-600">{a.hospitalName}</p>
                <p className="text-sm text-neutral-600">{a.department.split(" — ")[1]}</p>
                {a.note ? (
                  <p className="mt-2 rounded-md bg-warning-100 p-2 text-xs text-neutral-800">{a.note}</p>
                ) : null}
                <Button size="sm" className="mt-3 w-full">
                  Mark Complete
                </Button>
              </div>
            ))}
            {upcoming.length === 0 ? (
              <p className="text-sm text-neutral-500">No upcoming appointments.</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

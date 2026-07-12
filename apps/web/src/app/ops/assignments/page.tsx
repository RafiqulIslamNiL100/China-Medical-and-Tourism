import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { assignmentBoard, availableDrivers, availableInterpreters } from "@/data/opsConsole";

export const metadata: Metadata = { title: "Assignment Board" };

export default function AssignmentBoardPage() {
  const unassigned = assignmentBoard.filter((a) => !a.assignedTo);
  const assigned = assignmentBoard.filter((a) => a.assignedTo);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Assignment Board</h1>

      {unassigned.length > 0 ? (
        <div className="rounded-[10px] border border-warning-600/30 bg-warning-100 p-4">
          <p className="text-sm font-bold text-neutral-900">
            {unassigned.length} unassigned item{unassigned.length === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-neutral-700">
            Assign a driver or interpreter before the scheduled date to avoid a service gap.
          </p>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 font-bold text-neutral-900">Unassigned</h2>
        <div className="flex flex-col gap-3">
          {unassigned.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-primary-700">{a.type}</p>
                <Link href={`/ops/cases/${a.caseId}`} className="font-semibold text-neutral-900 hover:text-primary-700">
                  {a.patientName}
                </Link>
                <p className="text-sm text-neutral-500">{a.detail}</p>
                <p className="text-xs text-neutral-500">{a.date}</p>
              </div>
              <select className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
                <option value="">Assign {a.type.toLowerCase()}…</option>
                {(a.type === "Driver" ? availableDrivers : availableInterpreters).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {unassigned.length === 0 ? (
            <p className="text-sm text-neutral-500">Everything is assigned. Nice work.</p>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-neutral-900">Assigned</h2>
        <div className="flex flex-col gap-3">
          {assigned.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-primary-700">{a.type}</p>
                <p className="font-semibold text-neutral-900">{a.patientName}</p>
                <p className="text-sm text-neutral-500">{a.detail}</p>
                <p className="text-xs text-neutral-500">{a.date}</p>
              </div>
              <Badge tone="success">{a.assignedTo}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

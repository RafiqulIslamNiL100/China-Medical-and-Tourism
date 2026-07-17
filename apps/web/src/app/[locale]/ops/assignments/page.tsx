"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/lib/auth-client";
import { fmtDateTime } from "@/lib/portal";
import {
  getAssignmentBoard,
  assignDriver,
  assignInterpreter,
  listDrivers,
  listInterpreters,
  type AssignmentBoardTransfer,
  type AssignmentBoardInterpreterSession,
  type DriverProfile,
  type InterpreterProfile,
} from "@/lib/api";

type Item =
  | ({ kind: "Driver" } & AssignmentBoardTransfer)
  | ({ kind: "Interpreter" } & AssignmentBoardInterpreterSession);

export default function AssignmentBoardPage() {
  const { accessToken } = useAuth();
  const [transfers, setTransfers] = useState<AssignmentBoardTransfer[]>([]);
  const [sessions, setSessions] = useState<AssignmentBoardInterpreterSession[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [interpreters, setInterpreters] = useState<InterpreterProfile[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!accessToken) return;
    const [board, driversList, interpretersList] = await Promise.all([
      getAssignmentBoard(accessToken),
      listDrivers(accessToken),
      listInterpreters(accessToken),
    ]);
    setTransfers(board.transfers);
    setSessions(board.interpreterSessions);
    setDrivers(driversList);
    setInterpreters(interpretersList);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleAssignDriver(transferId: string, driverId: string) {
    if (!accessToken || !driverId) return;
    await assignDriver(accessToken, transferId, driverId);
    await load();
  }

  async function handleAssignInterpreter(sessionId: string, interpreterId: string) {
    if (!accessToken || !interpreterId) return;
    await assignInterpreter(accessToken, sessionId, interpreterId);
    await load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  const items: Item[] = [
    ...transfers.map((t) => ({ kind: "Driver" as const, ...t })),
    ...sessions.map((s) => ({ kind: "Interpreter" as const, ...s })),
  ];
  const unassigned = items.filter((a) => !a.assignedTo);
  const assigned = items.filter((a) => a.assignedTo);

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
              key={`${a.kind}-${a.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-primary-700">{a.kind}</p>
                <Link href={`/ops/cases/${a.applicationId}`} className="font-semibold text-neutral-900 hover:text-primary-700">
                  {a.refNumber}
                </Link>
                <p className="text-sm text-neutral-500">
                  {a.kind === "Driver" ? `${a.direction} · ${a.pickupLocation}` : a.department ?? "Hospital visit"}
                </p>
                <p className="text-xs text-neutral-500">
                  {fmtDateTime(a.kind === "Driver" ? a.scheduledAt : a.hospitalVisitAt)}
                </p>
              </div>
              <select
                defaultValue=""
                onChange={(e) =>
                  a.kind === "Driver" ? handleAssignDriver(a.id, e.target.value) : handleAssignInterpreter(a.id, e.target.value)
                }
                className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              >
                <option value="" disabled>
                  Assign {a.kind.toLowerCase()}…
                </option>
                {(a.kind === "Driver" ? drivers : interpreters).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
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
              key={`${a.kind}-${a.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold text-primary-700">{a.kind}</p>
                <p className="font-semibold text-neutral-900">{a.refNumber}</p>
                <p className="text-sm text-neutral-500">
                  {a.kind === "Driver" ? `${a.direction} · ${a.pickupLocation}` : a.department ?? "Hospital visit"}
                </p>
                <p className="text-xs text-neutral-500">
                  {fmtDateTime(a.kind === "Driver" ? a.scheduledAt : a.hospitalVisitAt)}
                </p>
              </div>
              <Badge tone="success">{a.assignedTo}</Badge>
            </div>
          ))}
          {assigned.length === 0 ? <p className="text-sm text-neutral-500">Nothing assigned yet.</p> : null}
        </div>
      </section>
    </div>
  );
}

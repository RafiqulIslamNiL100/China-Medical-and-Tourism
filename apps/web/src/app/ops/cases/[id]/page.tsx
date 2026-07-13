"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDateTime, slaRiskFor } from "@/lib/portal";
import {
  getApplication,
  listInternalNotes,
  addInternalNote,
  reassignApplication,
  listCaseManagers,
  listTransfers,
  listInterpreterSessions,
  assignDriver,
  assignInterpreter,
  listDrivers,
  listInterpreters,
  ApiError,
  type Application,
  type InternalNote,
  type CaseManager,
  type Transfer,
  type InterpreterSession,
  type DriverProfile,
  type InterpreterProfile,
} from "@/lib/api";

export default function OpsCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params.id;
  const { accessToken } = useAuth();

  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
  const [reassigning, setReassigning] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [sessions, setSessions] = useState<InterpreterSession[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [interpreters, setInterpreters] = useState<InterpreterProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    try {
      const [app, notesList, transfersList, sessionsList, driversList, interpretersList, managers] = await Promise.all([
        getApplication(accessToken, applicationId),
        listInternalNotes(accessToken, applicationId),
        listTransfers(accessToken, applicationId),
        listInterpreterSessions(accessToken, applicationId),
        listDrivers(accessToken),
        listInterpreters(accessToken),
        listCaseManagers(accessToken),
      ]);
      setApplication(app);
      setNotes(notesList);
      setTransfers(transfersList);
      setSessions(sessionsList);
      setDrivers(driversList);
      setInterpreters(interpretersList);
      setCaseManagers(managers);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setApplication(null);
      else setError(err instanceof ApiError ? err.message : "Could not load this case.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, applicationId]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !noteText.trim()) return;
    const created = await addInternalNote(accessToken, applicationId, noteText.trim());
    setNotes((prev) => [...prev, created]);
    setNoteText("");
  }

  async function handleReassign(caseManagerUserId: string) {
    if (!accessToken || !caseManagerUserId) return;
    try {
      const updated = await reassignApplication(accessToken, applicationId, caseManagerUserId);
      setApplication((prev) => (prev ? { ...prev, ...updated } : updated));
      setReassigning(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reassign this case.");
    }
  }

  async function handleAssignDriver(transferId: string, driverId: string) {
    if (!accessToken || !driverId) return;
    const updated = await assignDriver(accessToken, transferId, driverId);
    setTransfers((prev) => prev.map((t) => (t.id === transferId ? updated : t)));
  }

  async function handleAssignInterpreter(sessionId: string, interpreterId: string) {
    if (!accessToken || !interpreterId) return;
    const updated = await assignInterpreter(accessToken, sessionId, interpreterId);
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
  }

  if (application === undefined) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;
  if (application === null) notFound();

  const currentManager = caseManagers.find((m) => m.userId === application.caseManagerUserId);

  return (
    <div className="flex flex-col gap-6">
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{application.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{application.patientName ?? "Patient"}</h1>
            <p className="text-sm text-neutral-500">
              {application.specialtySlug} &middot; {application.patientCountry ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{statusLabel(application.status)}</Badge>
            <SlaChip risk={slaRiskFor(application.submittedAt, application.status)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-neutral-900">Internal notes</h2>
          <p className="mb-4 text-xs text-neutral-500">
            Visible to Case Managers and Admins only — never shown to the patient or hospital.
          </p>
          <div className="flex flex-col gap-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-md bg-neutral-100 p-3">
                <p className="text-sm text-neutral-700">{n.note}</p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">{fmtDateTime(n.createdAt)}</p>
              </div>
            ))}
            {notes.length === 0 ? <p className="text-sm text-neutral-500">No internal notes yet.</p> : null}
          </div>
          <form onSubmit={handleAddNote} className="mt-4 flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add an internal note…"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
            <Button type="submit" size="sm">
              Add Note
            </Button>
          </form>
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Case manager</h2>
            <p className="text-sm text-neutral-700">{currentManager?.email ?? "Unassigned"}</p>
            {reassigning ? (
              <select
                autoFocus
                defaultValue=""
                onChange={(e) => handleReassign(e.target.value)}
                className="mt-3 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
              >
                <option value="" disabled>
                  Choose a case manager…
                </option>
                {caseManagers.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.email}
                  </option>
                ))}
              </select>
            ) : (
              <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setReassigning(true)}>
                Reassign
              </Button>
            )}
          </div>

          <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Assignments</h2>
            <div className="flex flex-col gap-3">
              {transfers.map((t) => (
                <div key={t.id} className="rounded-md border border-neutral-300 p-3">
                  <p className="text-xs font-semibold text-primary-700">Driver &middot; {t.direction}</p>
                  <p className="text-sm text-neutral-700">{t.pickupLocation}</p>
                  <p className="text-xs text-neutral-500">{fmtDateTime(t.scheduledAt)}</p>
                  {t.driverId ? (
                    <Badge tone="success">{drivers.find((d) => d.id === t.driverId)?.fullName ?? "Assigned"}</Badge>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) => handleAssignDriver(t.id, e.target.value)}
                      className="mt-2 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
                    >
                      <option value="" disabled>
                        Assign driver…
                      </option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              {sessions.map((s) => (
                <div key={s.id} className="rounded-md border border-neutral-300 p-3">
                  <p className="text-xs font-semibold text-primary-700">Interpreter{s.department ? ` · ${s.department}` : ""}</p>
                  <p className="text-xs text-neutral-500">{fmtDateTime(s.hospitalVisitAt)}</p>
                  {s.interpreterId ? (
                    <Badge tone="success">
                      {interpreters.find((i) => i.id === s.interpreterId)?.fullName ?? "Assigned"}
                    </Badge>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) => handleAssignInterpreter(s.id, e.target.value)}
                      className="mt-2 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
                    >
                      <option value="" disabled>
                        Assign interpreter…
                      </option>
                      {interpreters.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.fullName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              {transfers.length === 0 && sessions.length === 0 ? (
                <p className="text-sm text-neutral-500">No transfers or interpreter sessions yet.</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

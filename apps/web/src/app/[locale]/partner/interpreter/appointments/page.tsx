"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SimplePartnerHeader } from "@/components/portal/SimplePartnerHeader";
import { useAuth } from "@/lib/auth-client";
import { useLocale } from "@/lib/i18n";
import { fmtDateTime } from "@/lib/portal";
import { listMyAppointments, completeInterpreterSession, type MyAppointment } from "@/lib/api";

export default function InterpreterAppointmentsPage() {
  const router = useRouter();
  const locale = useLocale();
  const { accessToken, user, logout } = useAuth();
  const [appointments, setAppointments] = useState<MyAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    setAppointments(await listMyAppointments(accessToken));
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleComplete(sessionId: string) {
    if (!accessToken) return;
    setCompletingId(sessionId);
    await completeInterpreterSession(accessToken, sessionId);
    await load();
    setCompletingId(null);
  }

  function handleLogout() {
    logout();
    router.push(`/${locale}/login`);
  }

  const upcoming = appointments.filter((a) => a.status === "Assigned");

  return (
    <div className="flex min-h-full flex-col bg-neutral-100">
      <SimplePartnerHeader title="My Appointments" subtitle={user?.email ?? ""} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-lg flex-1 p-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : (
          <section>
            <h2 className="mb-3 font-bold text-neutral-900">Upcoming</h2>
            <div className="flex flex-col gap-3">
              {upcoming.map((a) => (
                <div key={a.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    {a.department ? <Badge tone="primary">{a.department}</Badge> : <span />}
                    <p className="text-sm font-bold text-neutral-900 tabular-nums">{fmtDateTime(a.hospitalVisitAt)}</p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-neutral-900">{a.patientName ?? "Patient"}</p>
                  {a.hospitalName ? <p className="text-sm text-neutral-600">{a.hospitalName}</p> : null}
                  {a.note ? <p className="mt-2 rounded-md bg-warning-100 p-2 text-xs text-neutral-800">{a.note}</p> : null}
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => handleComplete(a.id)}
                    disabled={completingId === a.id}
                  >
                    {completingId === a.id ? "Marking…" : "Mark Complete"}
                  </Button>
                </div>
              ))}
              {upcoming.length === 0 ? <p className="text-sm text-neutral-500">No upcoming appointments.</p> : null}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

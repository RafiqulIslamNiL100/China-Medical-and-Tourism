"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { listModerationQueue, resolveModerationItem, searchHospitals, ApiError, type ModerationItem } from "@/lib/api";

export default function AdminHospitalModerationPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([listModerationQueue(accessToken), searchHospitals()])
      .then(([queue, hospitals]) => {
        setItems(queue.filter((i) => !i.resolvedAt));
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleApprove(item: ModerationItem) {
    if (!accessToken) return;
    try {
      await resolveModerationItem(accessToken, item.id, true);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not approve this change.");
    }
  }

  async function handleReject(item: ModerationItem) {
    if (!accessToken || !rejectionReason.trim()) return;
    try {
      await resolveModerationItem(accessToken, item.id, false, rejectionReason.trim());
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setRejectingId(null);
      setRejectionReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject this change.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Hospital Listing Moderation</h1>
      <p className="text-sm text-neutral-500">
        Changes to hospital and doctor profiles require approval before they go live.
      </p>
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{hospitalNames[item.hospitalId] ?? "Hospital"}</p>
            <p className="mt-1 text-sm text-neutral-700">{item.changeSummary}</p>
            <p className="mt-1 text-xs text-neutral-500">Submitted {fmtDate(item.submittedAt)}</p>
            {rejectingId === item.id ? (
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  required
                  rows={2}
                  placeholder="Reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="text-danger-600" onClick={() => handleReject(item)}>
                    Confirm Reject
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setRejectingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => handleApprove(item)}>
                  Approve
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setRejectingId(item.id)}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            No pending listing changes.
          </div>
        ) : null}
      </div>
    </div>
  );
}

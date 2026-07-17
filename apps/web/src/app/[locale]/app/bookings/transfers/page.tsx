"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDateTime } from "@/lib/portal";
import { listApplications, listTransfers, requestTransfer, ApiError, type Application, type Transfer } from "@/lib/api";

export default function TransfersPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationId, setApplicationId] = useState("");
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [direction, setDirection] = useState<"Arrival" | "Departure">("Arrival");
  const [flightNumber, setFlightNumber] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listApplications(accessToken).then((res) => {
      const active = res.data.filter((a) => a.status !== "Declined");
      setApplications(active);
      if (active[0]) setApplicationId(active[0].id);
    });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !applicationId) return;
    listTransfers(accessToken, applicationId).then(setTransfers);
  }, [accessToken, applicationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !applicationId) return;
    setError(null);
    setSubmitting(true);
    try {
      const created = await requestTransfer(accessToken, applicationId, {
        direction,
        flightNumber: flightNumber || undefined,
        scheduledAt: new Date(scheduledAt).toISOString(),
        pickupLocation,
      });
      setTransfers((prev) => [...prev, created]);
      setFlightNumber("");
      setScheduledAt("");
      setPickupLocation("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not request transfer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Airport Transfers</h1>
      <p className="text-sm text-neutral-500">
        Request a pickup or drop-off and your case manager will assign a driver.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        {error ? <p className="text-sm text-danger-700">{error}</p> : null}
        <div className="flex flex-col gap-1">
          <label htmlFor="case" className="text-sm font-semibold text-neutral-900">
            Application
          </label>
          <select
            id="case"
            required
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.refNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="direction" className="text-sm font-semibold text-neutral-900">
            Direction
          </label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as "Arrival" | "Departure")}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          >
            <option value="Arrival">Airport Arrival</option>
            <option value="Departure">Airport Departure</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="flight" className="text-sm font-semibold text-neutral-900">
              Flight number
            </label>
            <input
              id="flight"
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="e.g. CA987"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="datetime" className="text-sm font-semibold text-neutral-900">
              Date &amp; time
            </label>
            <input
              id="datetime"
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dropoff" className="text-sm font-semibold text-neutral-900">
            Drop-off location
          </label>
          <input
            id="dropoff"
            type="text"
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Hotel name or hospital"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
        </div>
        <Button type="submit" className="w-fit" disabled={submitting || !applicationId}>
          {submitting ? "Requesting…" : "Request Transfer"}
        </Button>
        <p className="text-xs text-neutral-500">
          A driver is typically assigned within 48 hours of your scheduled service.
        </p>
      </form>

      <div>
        <h2 className="mb-3 font-bold text-neutral-900">Requested transfers</h2>
        <div className="flex flex-col gap-2">
          {transfers.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {t.direction} &middot; {t.pickupLocation}
                </p>
                <p className="text-xs text-neutral-500">
                  {fmtDateTime(t.scheduledAt)}
                  {t.flightNumber ? ` · ${t.flightNumber}` : ""}
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-500">{t.status}</span>
            </div>
          ))}
          {transfers.length === 0 ? <p className="text-sm text-neutral-500">No transfers requested yet.</p> : null}
        </div>
      </div>
    </div>
  );
}

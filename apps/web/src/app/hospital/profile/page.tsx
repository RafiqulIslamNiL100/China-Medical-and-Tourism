"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { getMyHospital, submitHospitalChange, ApiError, type Hospital } from "@/lib/api";

export default function HospitalProfilePage() {
  const { accessToken } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [form, setForm] = useState({ name: "", description: "", facilities: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken)
      .then((h) => {
        setHospital(h);
        setForm({ name: h.name, description: h.description, facilities: h.facilities.join(", ") });
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !hospital) return;
    setSaving(true);
    setError(null);
    setSubmittedMessage(null);
    try {
      await submitHospitalChange(accessToken, hospital.id, {
        name: form.name,
        description: form.description,
        facilities: form.facilities.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setSubmittedMessage("Change request submitted — an admin will review it before it goes live.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (!hospital) return <p className="text-sm text-neutral-500">Could not load your hospital profile.</p>;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Hospital Profile</h1>
        <Badge tone="primary">{hospital.status}</Badge>
      </div>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Basic information</h2>
        <p className="mb-3 text-xs text-neutral-500">
          Changes are submitted for admin review before they go live on the public listing.
        </p>
        {error ? <p className="mb-3 text-sm text-danger-700">{error}</p> : null}
        {submittedMessage ? <p className="mb-3 text-sm text-success-600">{submittedMessage}</p> : null}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Hospital name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-semibold text-neutral-900">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="facilities" className="text-sm font-semibold text-neutral-900">
              Facilities, comma separated
            </label>
            <input
              id="facilities"
              value={form.facilities}
              onChange={(e) => setForm((f) => ({ ...f, facilities: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" size="sm" className="w-fit" disabled={saving}>
            {saving ? "Submitting…" : "Submit for review"}
          </Button>
        </form>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Accreditations</h2>
        <div className="flex flex-wrap gap-2">
          {hospital.accreditations.map((a) => (
            <Badge key={a} tone="primary">
              {a}
            </Badge>
          ))}
          {hospital.accreditations.length === 0 ? <p className="text-sm text-neutral-500">None listed.</p> : null}
        </div>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">City &amp; languages</h2>
        <p className="text-sm text-neutral-700">City: {hospital.citySlug}</p>
        <p className="text-sm text-neutral-700">Languages: {hospital.languages.join(", ") || "—"}</p>
      </section>
    </div>
  );
}

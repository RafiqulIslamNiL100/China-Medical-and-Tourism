"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { addDependent, listDependents, ApiError, type Dependent } from "@/lib/api";

export default function DependentsPage() {
  const { accessToken } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", relationship: "", dateOfBirth: "" });

  useEffect(() => {
    if (!accessToken) return;
    listDependents(accessToken)
      .then(setDependents)
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await addDependent(accessToken, form);
      setDependents((prev) => [...prev, created]);
      setForm({ fullName: "", relationship: "", dateOfBirth: "" });
      setAdding(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add dependent.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">My Dependents</h1>
        <Button size="sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add Dependent"}
        </Button>
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
          {error ? <p className="text-sm text-danger-700 sm:basis-full">{error}</p> : null}
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-900">Full name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-900">Relationship</label>
            <input
              required
              value={form.relationship}
              onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-900">Date of birth</label>
            <input
              required
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" size="sm">Save</Button>
        </form>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {dependents.map((d) => (
          <div key={d.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{d.fullName}</p>
            <p className="text-sm text-neutral-500">{d.relationship}</p>
            <p className="mt-2 text-xs text-neutral-500">Date of birth: {fmtDate(d.dateOfBirth)}</p>
          </div>
        ))}
        {dependents.length === 0 && !adding ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-neutral-300 p-5 text-center text-sm text-neutral-500">
            Add a family member to manage their treatment application under your account.
            <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
              Add Dependent
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

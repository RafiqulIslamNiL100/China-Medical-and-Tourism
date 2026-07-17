"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { getMyHospital, listPackages, addPackage, ApiError, type TreatmentPackage } from "@/lib/api";

const emptyForm = { name: "", specialtySlug: "", description: "", priceMinUsd: "", priceMaxUsd: "", includes: "" };

export default function HospitalPackagesPage() {
  const { accessToken } = useAuth();
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken)
      .then(async (hospital) => {
        setHospitalId(hospital.id);
        setPackages(await listPackages(hospital.id));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !hospitalId) return;
    setError(null);
    try {
      const created = await addPackage(accessToken, hospitalId, {
        name: form.name,
        specialtySlug: form.specialtySlug,
        description: form.description,
        priceMinUsd: Number(form.priceMinUsd),
        priceMaxUsd: Number(form.priceMaxUsd),
        includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setPackages((prev) => [...prev, created]);
      setForm(emptyForm);
      setAdding(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add package.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Treatment Packages</h1>
        <Button size="sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add Package"}
        </Button>
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-2">
          {error ? <p className="text-sm text-danger-700 sm:col-span-2">{error}</p> : null}
          <input required placeholder="Package name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required placeholder="Specialty slug" value={form.specialtySlug} onChange={(e) => setForm((f) => ({ ...f, specialtySlug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Min price $" value={form.priceMinUsd} onChange={(e) => setForm((f) => ({ ...f, priceMinUsd: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Max price $" value={form.priceMaxUsd} onChange={(e) => setForm((f) => ({ ...f, priceMaxUsd: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
          <input placeholder="Includes, comma separated" value={form.includes} onChange={(e) => setForm((f) => ({ ...f, includes: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
          <Button type="submit" size="sm" className="w-fit">Save</Button>
        </form>
      ) : null}

      <div className="flex flex-col gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Badge tone="primary">{pkg.specialtySlug}</Badge>
                <h2 className="mt-2 font-bold text-neutral-900">{pkg.name}</h2>
              </div>
              <Badge tone="success">{pkg.status ?? "Active"}</Badge>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{pkg.description}</p>
            <p className="mt-2 font-semibold text-primary-700">
              ${Number(pkg.priceMinUsd).toLocaleString()}–${Number(pkg.priceMaxUsd).toLocaleString()}
            </p>
          </div>
        ))}
        {packages.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
            No treatment packages yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}

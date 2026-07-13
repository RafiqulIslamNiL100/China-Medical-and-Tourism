"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { getMyHospital, listDoctors, addDoctor, ApiError, type Doctor } from "@/lib/api";

const emptyForm = { slug: "", name: "", specialtySlug: "", credentials: "", yearsExperience: "", languages: "", bio: "" };

export default function HospitalDoctorsPage() {
  const { accessToken } = useAuth();
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyHospital(accessToken)
      .then(async (hospital) => {
        setHospitalId(hospital.id);
        setDoctors(await listDoctors(hospital.id));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !hospitalId) return;
    setError(null);
    try {
      const created = await addDoctor(accessToken, hospitalId, {
        slug: form.slug,
        name: form.name,
        specialtySlug: form.specialtySlug,
        credentials: form.credentials,
        yearsExperience: Number(form.yearsExperience),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
        bio: form.bio,
      });
      setDoctors((prev) => [...prev, created]);
      setForm(emptyForm);
      setAdding(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add doctor.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Doctors</h1>
        <Button size="sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add Doctor"}
        </Button>
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-2">
          {error ? <p className="text-sm text-danger-700 sm:col-span-2">{error}</p> : null}
          <input required placeholder="Slug (e.g. li-wei)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required placeholder="Specialty slug (e.g. cardiology)" value={form.specialtySlug} onChange={(e) => setForm((f) => ({ ...f, specialtySlug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required placeholder="Credentials" value={form.credentials} onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Years of experience" value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required placeholder="Languages, comma separated" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <textarea required placeholder="Bio" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
          <Button type="submit" size="sm" className="w-fit">Save</Button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Languages</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-neutral-900">{d.name}</td>
                <td className="px-4 py-3 text-neutral-700">{d.specialtySlug}</td>
                <td className="px-4 py-3 text-neutral-700">{d.yearsExperience} yrs</td>
                <td className="px-4 py-3 text-neutral-700">{d.languages.join(", ")}</td>
              </tr>
            ))}
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  No doctors listed yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

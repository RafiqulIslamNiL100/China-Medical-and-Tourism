"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { specialties } from "@/data/hospitals";
import {
  listModerationQueue,
  resolveModerationItem,
  listAllHospitalsAdmin,
  createHospital,
  adminUpdateHospital,
  listDoctors,
  adminCreateDoctor,
  listPackages,
  adminCreatePackage,
  listCitiesAdmin,
  createCity,
  ApiError,
  type ModerationItem,
  type Hospital,
  type Doctor,
  type TreatmentPackage,
  type City,
} from "@/lib/api";

const STATUSES = ["Draft", "PendingApproval", "Published", "Rejected"] as const;
const PRICE_TIERS = ["$$", "$$$", "$$$$"];

type HospitalFormState = {
  slug: string;
  name: string;
  citySlug: string;
  description: string;
  richProfileMarkdown: string;
  priceTier: string;
  accreditations: string;
  languages: string;
  facilities: string;
  status: (typeof STATUSES)[number];
};

type CityFormState = { slug: string; name: string; tagline: string; climate: string };

const emptyCityForm: CityFormState = { slug: "", name: "", tagline: "", climate: "" };

type DoctorFormState = {
  slug: string;
  name: string;
  specialtySlug: string;
  credentials: string;
  yearsExperience: string;
  languages: string;
  bio: string;
};

type PackageFormState = {
  name: string;
  specialtySlug: string;
  description: string;
  priceMinUsd: string;
  priceMaxUsd: string;
  includes: string;
};

const emptyHospitalForm: HospitalFormState = {
  slug: "",
  name: "",
  citySlug: "",
  description: "",
  richProfileMarkdown: "",
  priceTier: "$$$",
  accreditations: "",
  languages: "",
  facilities: "",
  status: "Published",
};

const emptyDoctorForm: DoctorFormState = {
  slug: "",
  name: "",
  specialtySlug: specialties[0].slug,
  credentials: "",
  yearsExperience: "",
  languages: "",
  bio: "",
};

const emptyPackageForm: PackageFormState = {
  name: "",
  specialtySlug: specialties[0].slug,
  description: "",
  priceMinUsd: "",
  priceMaxUsd: "",
  includes: "",
};

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function AdminHospitalModerationPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [cities, setCities] = useState<City[]>([]);
  const [creatingCity, setCreatingCity] = useState(false);
  const [cityForm, setCityForm] = useState<CityFormState>(emptyCityForm);

  const [creatingHospital, setCreatingHospital] = useState(false);
  const [hospitalForm, setHospitalForm] = useState<HospitalFormState>(emptyHospitalForm);
  const [expandedHospitalId, setExpandedHospitalId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<HospitalFormState | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [doctorForm, setDoctorForm] = useState<DoctorFormState>(emptyDoctorForm);
  const [packageForm, setPackageForm] = useState<PackageFormState>(emptyPackageForm);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);

  function refreshHospitals(token: string) {
    return listAllHospitalsAdmin(token).then(setHospitals);
  }

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([listModerationQueue(accessToken), refreshHospitals(accessToken), listCitiesAdmin(accessToken)])
      .then(([queue, , cityList]) => {
        setItems(queue.filter((i) => !i.resolvedAt));
        setCities(cityList);
        setHospitalForm((f) => (f.citySlug ? f : { ...f, citySlug: cityList[0]?.slug ?? "" }));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    setHospitalNames(Object.fromEntries(hospitals.map((h) => [h.id, h.name])));
  }, [hospitals]);

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

  async function handleCreateCity(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await createCity(accessToken, {
        slug: cityForm.slug,
        name: cityForm.name,
        tagline: cityForm.tagline || undefined,
        climate: cityForm.climate || undefined,
      });
      setCities((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setHospitalForm((f) => (f.citySlug ? f : { ...f, citySlug: created.slug }));
      setCityForm(emptyCityForm);
      setCreatingCity(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create city.");
    }
  }

  async function handleCreateHospital(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await createHospital(accessToken, {
        slug: hospitalForm.slug,
        name: hospitalForm.name,
        citySlug: hospitalForm.citySlug,
        description: hospitalForm.description,
        richProfileMarkdown: hospitalForm.richProfileMarkdown || undefined,
        priceTier: hospitalForm.priceTier,
        accreditations: splitList(hospitalForm.accreditations),
        languages: splitList(hospitalForm.languages),
        facilities: splitList(hospitalForm.facilities),
        status: hospitalForm.status,
      });
      setHospitals((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setHospitalForm(emptyHospitalForm);
      setCreatingHospital(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create hospital.");
    }
  }

  function openHospital(hospital: Hospital) {
    if (expandedHospitalId === hospital.id) {
      setExpandedHospitalId(null);
      setEditForm(null);
      return;
    }
    setExpandedHospitalId(hospital.id);
    setEditForm({
      slug: hospital.slug,
      name: hospital.name,
      citySlug: hospital.citySlug,
      description: hospital.description,
      richProfileMarkdown: hospital.richProfileMarkdown ?? "",
      priceTier: hospital.priceTier,
      accreditations: hospital.accreditations.join(", "),
      languages: hospital.languages.join(", "),
      facilities: hospital.facilities.join(", "),
      status: hospital.status as (typeof STATUSES)[number],
    });
    setShowDoctorForm(false);
    setShowPackageForm(false);
    setDoctorForm(emptyDoctorForm);
    setPackageForm(emptyPackageForm);
    if (accessToken) {
      Promise.all([listDoctors(hospital.id), listPackages(hospital.id)]).then(([d, p]) => {
        setDoctors(d);
        setPackages(p);
      });
    }
  }

  async function handleSaveHospital(hospitalId: string) {
    if (!accessToken || !editForm) return;
    setError(null);
    try {
      const updated = await adminUpdateHospital(accessToken, hospitalId, {
        name: editForm.name,
        description: editForm.description,
        richProfileMarkdown: editForm.richProfileMarkdown,
        citySlug: editForm.citySlug,
        priceTier: editForm.priceTier,
        accreditations: splitList(editForm.accreditations),
        languages: splitList(editForm.languages),
        facilities: splitList(editForm.facilities),
        status: editForm.status,
      });
      setHospitals((prev) => prev.map((h) => (h.id === hospitalId ? updated : h)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save hospital changes.");
    }
  }

  async function handleAddDoctor(e: React.FormEvent, hospitalId: string) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await adminCreateDoctor(accessToken, hospitalId, {
        slug: doctorForm.slug,
        name: doctorForm.name,
        specialtySlug: doctorForm.specialtySlug,
        credentials: doctorForm.credentials,
        yearsExperience: Number(doctorForm.yearsExperience) || 0,
        languages: splitList(doctorForm.languages),
        bio: doctorForm.bio,
      });
      setDoctors((prev) => [...prev, created]);
      setDoctorForm(emptyDoctorForm);
      setShowDoctorForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add doctor.");
    }
  }

  async function handleAddPackage(e: React.FormEvent, hospitalId: string) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await adminCreatePackage(accessToken, hospitalId, {
        name: packageForm.name,
        specialtySlug: packageForm.specialtySlug,
        description: packageForm.description,
        priceMinUsd: Number(packageForm.priceMinUsd) || 0,
        priceMaxUsd: Number(packageForm.priceMaxUsd) || 0,
        includes: splitList(packageForm.includes),
      });
      setPackages((prev) => [...prev, created]);
      setPackageForm(emptyPackageForm);
      setShowPackageForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add treatment package.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      {error ? <p className="rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-600">{error}</p> : null}

      {/* --- Hospitals: create + direct edit + doctors/packages --------------------------- */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Hospitals</h1>
            <p className="text-sm text-neutral-500">Create listings directly, edit any field, and manage doctors and treatment packages.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCreatingCity((v) => !v)}>
              {creatingCity ? "Cancel" : "New City"}
            </Button>
            <Button size="sm" onClick={() => setCreatingHospital((v) => !v)}>
              {creatingHospital ? "Cancel" : "New Hospital"}
            </Button>
          </div>
        </div>

        {creatingCity ? (
          <form onSubmit={handleCreateCity} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-2">
            <input required placeholder="Slug (e.g. xi-an)" value={cityForm.slug} onChange={(e) => setCityForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input required placeholder="Name (e.g. Xi'an)" value={cityForm.name} onChange={(e) => setCityForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input placeholder="Tagline (optional)" value={cityForm.tagline} onChange={(e) => setCityForm((f) => ({ ...f, tagline: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input placeholder="Climate (optional)" value={cityForm.climate} onChange={(e) => setCityForm((f) => ({ ...f, climate: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <Button type="submit" size="sm" className="w-fit sm:col-span-2">Create City</Button>
          </form>
        ) : null}

        {creatingHospital ? (
          <form onSubmit={handleCreateHospital} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-2">
            <input required placeholder="Slug (e.g. beijing-united-hospital)" value={hospitalForm.slug} onChange={(e) => setHospitalForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input required placeholder="Name" value={hospitalForm.name} onChange={(e) => setHospitalForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <select value={hospitalForm.citySlug} onChange={(e) => setHospitalForm((f) => ({ ...f, citySlug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select value={hospitalForm.priceTier} onChange={(e) => setHospitalForm((f) => ({ ...f, priceTier: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
              {PRICE_TIERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <textarea required placeholder="Description (short summary shown at the top of the profile)" rows={3} value={hospitalForm.description} onChange={(e) => setHospitalForm((f) => ({ ...f, description: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-neutral-500">
                Full Profile (optional — Markdown, supports tables via GFM: | Col | Col |)
              </label>
              <textarea placeholder="## Section heading&#10;&#10;| Department | Notes |&#10;|---|---|&#10;| Cardiology | ... |" rows={10} value={hospitalForm.richProfileMarkdown} onChange={(e) => setHospitalForm((f) => ({ ...f, richProfileMarkdown: e.target.value }))} className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-xs" />
            </div>
            <input placeholder="Accreditations (comma-separated)" value={hospitalForm.accreditations} onChange={(e) => setHospitalForm((f) => ({ ...f, accreditations: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input placeholder="Languages (comma-separated)" value={hospitalForm.languages} onChange={(e) => setHospitalForm((f) => ({ ...f, languages: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input placeholder="Facilities (comma-separated)" value={hospitalForm.facilities} onChange={(e) => setHospitalForm((f) => ({ ...f, facilities: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
            <select value={hospitalForm.status} onChange={(e) => setHospitalForm((f) => ({ ...f, status: e.target.value as (typeof STATUSES)[number] }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button type="submit" size="sm" className="w-fit sm:col-span-2">Create Hospital</Button>
          </form>
        ) : null}

        <div className="flex flex-col gap-3">
          {hospitals.map((h) => (
            <div key={h.id} className="rounded-[10px] border border-neutral-300 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => openHospital(h)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div>
                  <p className="font-bold text-neutral-900">{h.name}</p>
                  <p className="text-xs text-neutral-500">{h.citySlug} · {h.priceTier}</p>
                </div>
                <Badge tone={h.status === "Published" ? "success" : h.status === "Rejected" ? "danger" : "neutral"}>{h.status}</Badge>
              </button>

              {expandedHospitalId === h.id && editForm ? (
                <div className="flex flex-col gap-6 border-t border-neutral-200 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={editForm.name} onChange={(e) => setEditForm((f) => f && { ...f, name: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" placeholder="Name" />
                    <select value={editForm.citySlug} onChange={(e) => setEditForm((f) => f && { ...f, citySlug: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
                      {cities.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                    <select value={editForm.priceTier} onChange={(e) => setEditForm((f) => f && { ...f, priceTier: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
                      {PRICE_TIERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <select value={editForm.status} onChange={(e) => setEditForm((f) => f && { ...f, status: e.target.value as (typeof STATUSES)[number] })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm((f) => f && { ...f, description: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Description" />
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-neutral-500">
                        Full Profile (optional — Markdown, supports tables via GFM)
                      </label>
                      <textarea rows={10} value={editForm.richProfileMarkdown} onChange={(e) => setEditForm((f) => f && { ...f, richProfileMarkdown: e.target.value })} className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-xs" />
                    </div>
                    <input value={editForm.accreditations} onChange={(e) => setEditForm((f) => f && { ...f, accreditations: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" placeholder="Accreditations (comma-separated)" />
                    <input value={editForm.languages} onChange={(e) => setEditForm((f) => f && { ...f, languages: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" placeholder="Languages (comma-separated)" />
                    <input value={editForm.facilities} onChange={(e) => setEditForm((f) => f && { ...f, facilities: e.target.value })} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Facilities (comma-separated)" />
                  </div>
                  <Button size="sm" className="w-fit" onClick={() => handleSaveHospital(h.id)}>Save Changes</Button>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900">Doctors ({doctors.length})</h3>
                      <Button size="sm" variant="secondary" onClick={() => setShowDoctorForm((v) => !v)}>
                        {showDoctorForm ? "Cancel" : "Add Doctor"}
                      </Button>
                    </div>
                    {showDoctorForm ? (
                      <form onSubmit={(e) => handleAddDoctor(e, h.id)} className="mt-3 grid gap-2 rounded-md border border-neutral-200 p-3 sm:grid-cols-2">
                        <input required placeholder="Slug" value={doctorForm.slug} onChange={(e) => setDoctorForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <input required placeholder="Name" value={doctorForm.name} onChange={(e) => setDoctorForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <select value={doctorForm.specialtySlug} onChange={(e) => setDoctorForm((f) => ({ ...f, specialtySlug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
                          {specialties.map((s) => (
                            <option key={s.slug} value={s.slug}>{s.name}</option>
                          ))}
                        </select>
                        <input required placeholder="Credentials" value={doctorForm.credentials} onChange={(e) => setDoctorForm((f) => ({ ...f, credentials: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <input required type="number" min={0} placeholder="Years experience" value={doctorForm.yearsExperience} onChange={(e) => setDoctorForm((f) => ({ ...f, yearsExperience: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <input placeholder="Languages (comma-separated)" value={doctorForm.languages} onChange={(e) => setDoctorForm((f) => ({ ...f, languages: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <textarea required placeholder="Bio" rows={2} value={doctorForm.bio} onChange={(e) => setDoctorForm((f) => ({ ...f, bio: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
                        <Button type="submit" size="sm" className="w-fit sm:col-span-2">Add Doctor</Button>
                      </form>
                    ) : null}
                    <ul className="mt-3 flex flex-col gap-1 text-sm text-neutral-700">
                      {doctors.map((d) => (
                        <li key={d.id}>{d.name} — {d.specialtySlug} ({d.yearsExperience}y)</li>
                      ))}
                      {doctors.length === 0 ? <li className="text-neutral-500">No doctors listed yet.</li> : null}
                    </ul>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900">Treatment Packages ({packages.length})</h3>
                      <Button size="sm" variant="secondary" onClick={() => setShowPackageForm((v) => !v)}>
                        {showPackageForm ? "Cancel" : "Add Package"}
                      </Button>
                    </div>
                    {showPackageForm ? (
                      <form onSubmit={(e) => handleAddPackage(e, h.id)} className="mt-3 grid gap-2 rounded-md border border-neutral-200 p-3 sm:grid-cols-2">
                        <input required placeholder="Name" value={packageForm.name} onChange={(e) => setPackageForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <select value={packageForm.specialtySlug} onChange={(e) => setPackageForm((f) => ({ ...f, specialtySlug: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
                          {specialties.map((s) => (
                            <option key={s.slug} value={s.slug}>{s.name}</option>
                          ))}
                        </select>
                        <input required type="number" min={0} placeholder="Price min USD" value={packageForm.priceMinUsd} onChange={(e) => setPackageForm((f) => ({ ...f, priceMinUsd: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <input required type="number" min={0} placeholder="Price max USD" value={packageForm.priceMaxUsd} onChange={(e) => setPackageForm((f) => ({ ...f, priceMaxUsd: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                        <textarea required placeholder="Description" rows={2} value={packageForm.description} onChange={(e) => setPackageForm((f) => ({ ...f, description: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
                        <input placeholder="Includes (comma-separated)" value={packageForm.includes} onChange={(e) => setPackageForm((f) => ({ ...f, includes: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
                        <Button type="submit" size="sm" className="w-fit sm:col-span-2">Add Package</Button>
                      </form>
                    ) : null}
                    <ul className="mt-3 flex flex-col gap-1 text-sm text-neutral-700">
                      {packages.map((p) => (
                        <li key={p.id}>{p.name} — ${p.priceMinUsd}–${p.priceMaxUsd}</li>
                      ))}
                      {packages.length === 0 ? <li className="text-neutral-500">No treatment packages listed yet.</li> : null}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {hospitals.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
              No hospitals yet.
            </div>
          ) : null}
        </div>
      </section>

      {/* --- Moderation queue: hospital_staff-submitted changes awaiting approval --------- */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Listing Moderation Queue</h2>
          <p className="text-sm text-neutral-500">
            Changes hospital staff submit for their own hospital require approval before they go live.
          </p>
        </div>

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
      </section>
    </div>
  );
}

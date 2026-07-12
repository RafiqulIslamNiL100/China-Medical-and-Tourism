import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { hospitals } from "@/data/hospitals";
import { currentHospitalStaff } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Hospital Profile" };

export default function HospitalProfilePage() {
  const hospital = hospitals.find((h) => h.slug === currentHospitalStaff.hospitalSlug)!;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Hospital Profile</h1>
        <Badge tone="primary">Published</Badge>
      </div>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Basic information</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Hospital name
            </label>
            <input
              id="name"
              defaultValue={hospital.name}
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
              defaultValue={hospital.description}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-semibold text-neutral-900">
                City
              </label>
              <input
                id="city"
                defaultValue={hospital.cityLabel}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="languages" className="text-sm font-semibold text-neutral-900">
                Languages spoken
              </label>
              <input
                id="languages"
                defaultValue={hospital.languages.join(", ")}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
          </div>
        </div>
        <Button size="sm" className="mt-4">
          Save changes
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Accreditations</h2>
        <div className="flex flex-wrap gap-2">
          {hospital.accreditations.map((a) => (
            <Badge key={a} tone="primary">
              {a}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-neutral-900">Facilities</h2>
          <Button size="sm" variant="secondary">
            Add facility
          </Button>
        </div>
        <ul className="flex flex-col gap-2 text-sm text-neutral-700">
          {hospital.facilities.map((f) => (
            <li key={f} className="flex items-center justify-between rounded-md border border-neutral-100 px-3 py-2">
              {f}
              <button className="text-xs font-semibold text-danger-600">Remove</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

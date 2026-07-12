import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { hospitals } from "@/data/hospitals";
import { currentHospitalStaff } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Doctors" };

export default function HospitalDoctorsPage() {
  const hospital = hospitals.find((h) => h.slug === currentHospitalStaff.hospitalSlug)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Doctors</h1>
        <Button size="sm">Add Doctor</Button>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {hospital.doctors.map((d) => (
              <tr key={d.slug} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-neutral-900">{d.name}</td>
                <td className="px-4 py-3 text-neutral-700">{d.specialty}</td>
                <td className="px-4 py-3 text-neutral-700">{d.yearsExperience} yrs</td>
                <td className="px-4 py-3 text-neutral-700">{d.languages.join(", ")}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-primary-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { hospitals } from "@/data/hospitals";
import { currentHospitalStaff } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Treatment Packages" };

export default function HospitalPackagesPage() {
  const hospital = hospitals.find((h) => h.slug === currentHospitalStaff.hospitalSlug)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Treatment Packages</h1>
        <Button size="sm">Add Package</Button>
      </div>

      <div className="flex flex-col gap-4">
        {hospital.packages.map((pkg) => (
          <div key={pkg.name} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Badge tone="primary">{pkg.specialty}</Badge>
                <h2 className="mt-2 font-bold text-neutral-900">{pkg.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="success">Active</Badge>
                <button className="text-xs font-semibold text-primary-700">Edit</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{pkg.description}</p>
            <p className="mt-2 font-semibold text-primary-700">
              ${pkg.priceRangeUsd[0].toLocaleString()}–${pkg.priceRangeUsd[1].toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

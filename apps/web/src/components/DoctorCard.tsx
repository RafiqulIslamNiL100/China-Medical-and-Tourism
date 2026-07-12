import Link from "next/link";
import type { Doctor } from "@/data/hospitals";

export function DoctorCard({
  doctor,
  hospitalSlug,
}: {
  doctor: Doctor;
  hospitalSlug: string;
}) {
  return (
    <Link
      href={`/hospitals/${hospitalSlug}/doctors/${doctor.slug}`}
      className="group flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
        {doctor.name
          .replace("Dr. ", "")
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div>
        <h3 className="font-bold text-neutral-900 group-hover:text-primary-700">
          {doctor.name}
        </h3>
        <p className="text-sm text-neutral-500">{doctor.specialty}</p>
      </div>
      <p className="text-xs text-neutral-500">
        {doctor.yearsExperience} yrs experience &middot; {doctor.languages.join(", ")}
      </p>
    </Link>
  );
}

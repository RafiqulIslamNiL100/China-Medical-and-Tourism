import Link from "next/link";
import { Stars } from "./Stars";
import { VerifiedBadge } from "./Badge";

export type HospitalCardData = {
  slug: string;
  name: string;
  cityLabel: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
};

export function HospitalCard({ hospital }: { hospital: HospitalCardData }) {
  return (
    <Link
      href={`/hospitals/${hospital.slug}`}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-neutral-300 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative flex h-28 items-end bg-gradient-to-br from-primary-600 to-primary-700 p-3">
        <div className="absolute top-3 left-3">
          <VerifiedBadge />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-[15px] font-bold text-neutral-900 group-hover:text-primary-700">
          {hospital.name}
        </h3>
        <p className="text-xs text-neutral-500">
          {hospital.cityLabel}
          {hospital.specialties.length > 0 ? ` · ${hospital.specialties.slice(0, 2).join(", ")}` : ""}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Stars rating={hospital.rating} />
          <span className="text-xs text-neutral-500">{hospital.reviewCount} reviews</span>
        </div>
      </div>
    </Link>
  );
}

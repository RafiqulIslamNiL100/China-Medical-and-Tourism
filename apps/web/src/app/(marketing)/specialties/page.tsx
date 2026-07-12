import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { specialties, hospitals } from "@/data/hospitals";

export const metadata: Metadata = {
  title: "Specialties",
  description: "Explore the medical specialties available through our partner hospitals in China.",
};

export default function SpecialtiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Specialties"
        title="Treatment specialties"
        description="From cardiology to fertility care, explore what our accredited hospitals treat and who offers it."
      />
      <Container className="grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {specialties.map((s) => {
          const count = hospitals.filter((h) => h.specialties.includes(s.name)).length;
          return (
            <Link
              key={s.slug}
              href={`/specialties/${s.slug}`}
              className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-neutral-900">{s.name}</h2>
              <p className="text-sm text-neutral-600">{s.blurb}</p>
              <p className="mt-2 text-xs font-semibold text-primary-700">
                {count} hospital{count === 1 ? "" : "s"} offering this specialty &rarr;
              </p>
            </Link>
          );
        })}
      </Container>
    </>
  );
}

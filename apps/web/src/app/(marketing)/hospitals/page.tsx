import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { HospitalCard } from "@/components/HospitalCard";
import { listCities, listSpecialties, searchHospitals } from "@/lib/api";

export const metadata: Metadata = {
  title: "Find a Hospital",
  description:
    "Browse accredited partner hospitals in Beijing, Shanghai, Guangzhou, Xi'an, and beyond by specialty and city.",
};

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; specialty?: string }>;
}) {
  const params = await searchParams;
  const [cities, specialties, { data: results }] = await Promise.all([
    listCities(),
    listSpecialties(),
    searchHospitals({ city: params.city, specialty: params.specialty }),
  ]);

  const cityNameBySlug = new Map(cities.map((c) => [c.slug, c.name]));
  const specialtyNameBySlug = new Map(specialties.map((s) => [s.slug, s.name]));

  const cards = results.map((h) => ({
    slug: h.slug,
    name: h.name,
    cityLabel: cityNameBySlug.get(h.citySlug) ?? h.citySlug,
    specialties: (h.specialtySlugs ?? [])
      .slice(0, 2)
      .map((slug) => specialtyNameBySlug.get(slug) ?? slug),
    rating: Number(h.rating),
    reviewCount: h.reviewCount,
  }));

  return (
    <>
      <PageHero
        eyebrow="Hospital Directory"
        title="Find an accredited hospital"
        description="Every hospital on this list is vetted for accreditation, staff credentials, and international-patient experience."
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
              City
            </h2>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link
                  href="/hospitals"
                  className={`block rounded-md px-2 py-1.5 ${
                    !params.city
                      ? "bg-primary-100 font-semibold text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  All cities
                </Link>
              </li>
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/hospitals?city=${c.slug}`}
                    className={`block rounded-md px-2 py-1.5 ${
                      params.city === c.slug
                        ? "bg-primary-100 font-semibold text-primary-700"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
              Specialty
            </h2>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link
                  href="/hospitals"
                  className={`block rounded-md px-2 py-1.5 ${
                    !params.specialty
                      ? "bg-primary-100 font-semibold text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  All specialties
                </Link>
              </li>
              {specialties.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hospitals?specialty=${s.slug}`}
                    className={`block rounded-md px-2 py-1.5 ${
                      params.specialty === s.slug
                        ? "bg-primary-100 font-semibold text-primary-700"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-neutral-500">
            {cards.length} hospital{cards.length === 1 ? "" : "s"} found
          </p>
          {cards.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((h) => (
                <HospitalCard key={h.slug} hospital={h} />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-neutral-300 p-10 text-center">
              <p className="font-semibold text-neutral-900">No hospitals match those filters</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try broadening your search, or{" "}
                <Link href="/contact" className="text-primary-700 underline">
                  talk to our team
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

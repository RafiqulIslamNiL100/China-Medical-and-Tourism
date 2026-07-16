import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { cities, specialties } from "@/data/hospitals";
import { searchTreatments } from "@/lib/api";

export const metadata: Metadata = {
  title: "Treatments",
  description: "Search treatment packages across every accredited partner hospital, by specialty, city, and price.",
};

export default async function TreatmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; specialty?: string }>;
}) {
  const params = await searchParams;
  const { data: results } = await searchTreatments({
    search: params.q,
    city: params.city,
    specialty: params.specialty,
    limit: 60,
  });

  function buildHref(overrides: Partial<{ q: string; city: string; specialty: string }>) {
    const next = { q: params.q, city: params.city, specialty: params.specialty, ...overrides };
    const usp = new URLSearchParams();
    if (next.q) usp.set("q", next.q);
    if (next.city) usp.set("city", next.city);
    if (next.specialty) usp.set("specialty", next.specialty);
    const qs = usp.toString();
    return qs ? `/treatments?${qs}` : "/treatments";
  }

  return (
    <>
      <PageHero
        eyebrow="Treatment Directory"
        title="Search treatment packages"
        description="Browse fixed-scope treatment packages from every accredited partner hospital — filter by specialty, city, or search by name."
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-6">
          <form action="/treatments" className="flex flex-col gap-2">
            {params.city ? <input type="hidden" name="city" value={params.city} /> : null}
            {params.specialty ? <input type="hidden" name="specialty" value={params.specialty} /> : null}
            <label htmlFor="q" className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={params.q ?? ""}
              placeholder="e.g. knee replacement"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </form>
          <div>
            <h2 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">City</h2>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link
                  href={buildHref({ city: undefined })}
                  className={`block rounded-md px-2 py-1.5 ${
                    !params.city ? "bg-primary-100 font-semibold text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  All cities
                </Link>
              </li>
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={buildHref({ city: c.slug })}
                    className={`block rounded-md px-2 py-1.5 ${
                      params.city === c.slug ? "bg-primary-100 font-semibold text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">Specialty</h2>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link
                  href={buildHref({ specialty: undefined })}
                  className={`block rounded-md px-2 py-1.5 ${
                    !params.specialty ? "bg-primary-100 font-semibold text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  All specialties
                </Link>
              </li>
              {specialties.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={buildHref({ specialty: s.slug })}
                    className={`block rounded-md px-2 py-1.5 ${
                      params.specialty === s.slug ? "bg-primary-100 font-semibold text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
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
            {results.length} treatment{results.length === 1 ? "" : "s"} found
          </p>
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {results.map((pkg) => {
                const specialtyLabel = specialties.find((s) => s.slug === pkg.specialtySlug)?.name ?? pkg.specialtySlug;
                const cityLabel = cities.find((c) => c.slug === pkg.hospital.citySlug)?.name ?? pkg.hospital.citySlug;
                return (
                  <Link
                    key={pkg.id}
                    href={`/hospitals/${pkg.hospital.slug}#packages`}
                    className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-neutral-900">{pkg.name}</h3>
                      <span className="whitespace-nowrap font-semibold text-primary-700">
                        ${Number(pkg.priceMinUsd).toLocaleString()}–${Number(pkg.priceMaxUsd).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="primary">{specialtyLabel}</Badge>
                      <Badge tone="neutral">{pkg.hospital.name}</Badge>
                      <Badge tone="neutral">{cityLabel}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{pkg.description}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-neutral-300 p-10 text-center">
              <p className="font-semibold text-neutral-900">No treatments match those filters</p>
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

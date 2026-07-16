import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { listSpecialties, searchHospitals } from "@/lib/api";

export const metadata: Metadata = {
  title: "Specialties",
  description: "Explore the medical specialties available through our partner hospitals in China.",
};

export default async function SpecialtiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allSpecialties = await listSpecialties();
  const filtered = q
    ? allSpecialties.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
    : allSpecialties;

  const withCounts = await Promise.all(
    filtered.map(async (s) => {
      const { data } = await searchHospitals({ specialty: s.slug, limit: 100 });
      return { ...s, count: data.length };
    }),
  );

  return (
    <>
      <PageHero
        eyebrow="Specialties"
        title="Treatment specialties"
        description="From cardiology to neurosurgery, explore what our accredited hospitals treat and who offers it."
      />
      <Container className="py-6">
        <form action="/specialties" className="flex max-w-md gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search specialties (e.g. cardiology, IVF, neurosurgery)"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
          <button
            type="submit"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </Container>
      <Container className="grid gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {withCounts.map((s) => (
          <Link
            key={s.slug}
            href={`/specialties/${s.slug}`}
            className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-neutral-900">{s.name}</h2>
            {s.blurb ? <p className="text-sm text-neutral-600">{s.blurb}</p> : null}
            <p className="mt-2 text-xs font-semibold text-primary-700">
              {s.count} hospital{s.count === 1 ? "" : "s"} offering this specialty &rarr;
            </p>
          </Link>
        ))}
        {withCounts.length === 0 ? (
          <p className="col-span-full text-sm text-neutral-500">No specialties match &ldquo;{q}&rdquo;.</p>
        ) : null}
      </Container>
    </>
  );
}

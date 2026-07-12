import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/Section";
import { HospitalCard } from "@/components/HospitalCard";
import { cities, hospitals } from "@/data/hospitals";

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return {};
  return { title: city.name, description: city.tagline };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) notFound();

  const cityHospitals = hospitals.filter((h) => h.city === city.slug);

  return (
    <>
      <PageHero eyebrow="Destination" title={city.name} description={city.tagline} />
      <Container className="flex flex-col gap-10 py-10">
        <section className="grid gap-4 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-1 font-bold text-neutral-900">Climate &amp; travel notes</h2>
            <p className="text-sm text-neutral-600">{city.climate}</p>
          </div>
          <div>
            <h2 className="mb-1 font-bold text-neutral-900">Getting around</h2>
            <p className="text-sm text-neutral-600">
              Airport transfers are arranged for every confirmed booking; our
              case managers coordinate pickup around your flight details.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            Hospitals in {city.name}
          </h2>
          {cityHospitals.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cityHospitals.map((h) => (
                <HospitalCard key={h.slug} hospital={h} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No hospitals listed yet for this city.</p>
          )}
        </section>
      </Container>
    </>
  );
}

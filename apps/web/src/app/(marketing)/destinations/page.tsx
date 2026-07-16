import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { listCities } from "@/lib/api";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore our partner destination cities across Asia.",
};

export default async function DestinationsPage() {
  const cities = await listCities();

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Where you'll be treated"
        description="Every destination city has an established international-patient program, from airport pickup to hotel partnerships."
      />
      <Container className="grid gap-5 py-10 sm:grid-cols-3">
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/destinations/${c.slug}`}
            className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-neutral-900">{c.name}</h2>
            <p className="text-sm text-neutral-600">{c.tagline}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

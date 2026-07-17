import type { Metadata } from "next";
import { connection } from "next/server";
import { Link } from "@/components/Link";
import { Container, PageHero } from "@/components/Section";
import { listCities } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Destinations",
    description: "Explore our partner destination cities across Asia.",
    path: "/destinations",
    locale,
  });
}

export default async function DestinationsPage() {
  // Keep this route dynamically (per-request) rendered rather than statically
  // prerendered at build time — the underlying listCities() fetch still uses its
  // own `revalidate` window (see lib/api.ts), so this doesn't lose caching, it just
  // avoids requiring a live backend to be reachable during `next build`/CI/Vercel
  // builds, matching how /hospitals and /specialties already behave (they read
  // searchParams, which has the same effect).
  await connection();
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

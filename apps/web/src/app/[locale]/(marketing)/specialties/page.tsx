import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";
import { SpecialtiesBrowser } from "@/components/SpecialtiesBrowser";
import { listSpecialties, searchHospitals } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Specialties",
    description: "Explore the medical specialties available through our partner hospitals in China.",
    path: "/specialties",
    locale,
  });
}

export default async function SpecialtiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allSpecialties = await listSpecialties();

  const withCounts = await Promise.all(
    allSpecialties.map(async (s) => {
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
      <Container className="py-6 pb-10">
        <SpecialtiesBrowser specialties={withCounts} initialQuery={q ?? ""} />
      </Container>
    </>
  );
}

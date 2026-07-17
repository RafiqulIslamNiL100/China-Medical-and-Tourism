import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Section";
import { Badge, VerifiedBadge } from "@/components/Badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/Button";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cities } from "@/data/hospitals";
import { searchHospitals, getHospital, listHospitalReviews, listSpecialties } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { buildMedicalOrganizationSchema } from "@/lib/structured-data";

async function findHospitalBySlug(slug: string) {
  const { data } = await searchHospitals();
  const match = data.find((h) => h.slug === slug);
  if (!match) return null;
  return getHospital(match.id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const hospital = await findHospitalBySlug(slug);
  if (!hospital) return {};
  return buildMetadata({
    title: hospital.name,
    description: hospital.description,
    path: `/hospitals/${slug}`,
    locale,
  });
}

export default async function HospitalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const hospital = await findHospitalBySlug(slug);
  if (!hospital) notFound();

  const [reviews, specialties] = await Promise.all([
    listHospitalReviews(hospital.id),
    listSpecialties(),
  ]);

  const cityLabel = cities.find((c) => c.slug === hospital.citySlug)?.name ?? hospital.citySlug;
  const specialtyNameBySlug = new Map(specialties.map((s) => [s.slug, s.name]));

  return (
    <>
      <JsonLd data={buildMedicalOrganizationSchema(hospital, cityLabel)} />
      <section className="border-b border-neutral-300/70 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <Container className="flex flex-col gap-4 py-12">
          <Breadcrumbs
            tone="onDark"
            items={[
              { label: "Home", href: "/" },
              { label: "Hospitals", href: "/hospitals" },
              { label: cityLabel, href: `/destinations/${hospital.citySlug}` },
              { label: hospital.name },
            ]}
          />
          <VerifiedBadge label="Verified Hospital" />
          <h1 className="text-3xl font-bold sm:text-4xl">{hospital.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-100">
            <Link
              href={`/destinations/${hospital.citySlug}`}
              className="underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              {cityLabel}, China
            </Link>
            <span className="text-white">
              <Stars rating={Number(hospital.rating)} />
            </span>
            <span>{hospital.reviewCount} reviews</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hospital.accreditations.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"
              >
                {a}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <div className="sticky top-[65px] z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
        <Container className="flex gap-1 overflow-x-auto py-2 text-sm">
          {[
            ["#overview", "Overview"],
            ...(hospital.richProfileMarkdown ? [["#profile", "Full Profile"]] : []),
            ["#reviews", "Reviews"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 font-medium whitespace-nowrap text-neutral-700 hover:bg-primary-100 hover:text-primary-700"
            >
              {label}
            </a>
          ))}
        </Container>
      </div>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-12">
          <section id="overview" className="scroll-mt-32">
            <h2 className="mb-3 text-xl font-bold text-neutral-900">Overview</h2>
            <p className="text-neutral-700">{hospital.description}</p>
            {hospital.specialtySlugs && hospital.specialtySlugs.length > 0 ? (
              <>
                <h3 className="mt-6 mb-2 font-bold text-neutral-900">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialtySlugs.map((s) => (
                    <Link
                      key={s}
                      href={`/specialties/${s}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-700 hover:border-primary-600 hover:text-primary-700"
                    >
                      {specialtyNameBySlug.get(s) ?? s}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
            <h3 className="mt-6 mb-2 font-bold text-neutral-900">Facilities</h3>
            <ul className="grid gap-1.5 text-sm text-neutral-700 sm:grid-cols-2">
              {hospital.facilities.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                  {f}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 mb-2 font-bold text-neutral-900">Languages spoken</h3>
            <p className="text-sm text-neutral-700">{hospital.languages.join(", ")}</p>
          </section>

          {hospital.richProfileMarkdown ? (
            <section id="profile" className="scroll-mt-32">
              <h2 className="mb-3 text-xl font-bold text-neutral-900">Full Profile</h2>
              <MarkdownContent>{hospital.richProfileMarkdown}</MarkdownContent>
            </section>
          ) : null}

          <section id="reviews" className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Patient reviews</h2>
            <div className="flex flex-col gap-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-neutral-500">No published reviews yet.</p>
              ) : null}
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <Badge tone="primary">Verified Patient</Badge>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-36">
          <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-neutral-900">Ready to apply?</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Submit your case and a specialist will respond within 3 business days.
            </p>
            <Button href="/register" className="mt-4 w-full">
              Start Application
            </Button>
            <Link
              href="/contact"
              className="mt-3 block text-center text-sm font-semibold text-primary-700"
            >
              Ask a question first
            </Link>
          </div>
        </aside>
      </Container>
    </>
  );
}

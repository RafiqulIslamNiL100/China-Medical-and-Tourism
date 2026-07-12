import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Section";
import { Badge, VerifiedBadge } from "@/components/Badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/Button";
import { DoctorCard } from "@/components/DoctorCard";
import { hospitals } from "@/data/hospitals";

export function generateStaticParams() {
  return hospitals.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hospital = hospitals.find((h) => h.slug === slug);
  if (!hospital) return {};
  return {
    title: hospital.name,
    description: hospital.description,
  };
}

export default async function HospitalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hospital = hospitals.find((h) => h.slug === slug);
  if (!hospital) notFound();

  return (
    <>
      <section className="border-b border-neutral-300/70 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <Container className="flex flex-col gap-4 py-12">
          <VerifiedBadge label="Verified Hospital" />
          <h1 className="text-3xl font-bold sm:text-4xl">{hospital.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-100">
            <span>{hospital.cityLabel}, China</span>
            <span className="text-white">
              <Stars rating={hospital.rating} />
            </span>
            <span>{hospital.reviewCount} reviews</span>
            <span>{hospital.priceTier}</span>
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
            ["#doctors", "Doctors"],
            ["#packages", "Packages"],
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
            <div className="mt-5 flex flex-wrap gap-2">
              {hospital.specialties.map((s) => (
                <Badge key={s} tone="primary">
                  {s}
                </Badge>
              ))}
            </div>
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

          <section id="doctors" className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Doctors</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {hospital.doctors.map((doc) => (
                <DoctorCard key={doc.slug} doctor={doc} hospitalSlug={hospital.slug} />
              ))}
            </div>
          </section>

          <section id="packages" className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Treatment packages</h2>
            <div className="flex flex-col gap-4">
              {hospital.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-neutral-900">{pkg.name}</h3>
                    <span className="font-semibold text-primary-700">
                      ${pkg.priceRangeUsd[0].toLocaleString()}–$
                      {pkg.priceRangeUsd[1].toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{pkg.description}</p>
                  <ul className="mt-3 grid gap-1 text-sm text-neutral-700 sm:grid-cols-2">
                    {pkg.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-neutral-500">
                    Estimated price — confirmed in writing after medical review.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="reviews" className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Patient reviews</h2>
            <div className="flex flex-col gap-4">
              {hospital.reviews.map((r) => (
                <div
                  key={r.patientName + r.date}
                  className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <Badge tone="primary">Verified Patient</Badge>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-2 text-xs font-semibold text-neutral-500">
                    {r.patientName} &middot; {r.country} &middot; {r.treatment}
                  </p>
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

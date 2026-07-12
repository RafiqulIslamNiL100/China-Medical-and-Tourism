import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/Section";
import { HospitalCard } from "@/components/HospitalCard";
import { specialties, hospitals } from "@/data/hospitals";

export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);
  if (!specialty) return {};
  return { title: specialty.name, description: specialty.blurb };
}

const faqBySpecialty: Record<string, { q: string; a: string }[]> = {
  oncology: [
    {
      q: "How long does cancer treatment typically take?",
      a: "It varies widely by cancer type and stage — your treating hospital provides a specific timeline as part of your treatment plan, typically ranging from a single procedure to several weeks of combined therapy.",
    },
  ],
  cardiology: [
    {
      q: "How soon can I fly after a cardiac procedure?",
      a: "Most interventional procedures allow air travel within 5–10 days, subject to your cardiologist's clearance — this is confirmed in your discharge plan.",
    },
  ],
  orthopedics: [
    {
      q: "What's the typical recovery time for joint replacement?",
      a: "Most patients begin walking with assistance within 24 hours and complete a structured 6-week physiotherapy plan before returning home.",
    },
  ],
  fertility: [
    {
      q: "How many clinic visits does an IVF cycle require?",
      a: "A typical cycle requires 8–12 days of in-person monitoring visits around stimulation, retrieval, and transfer — we help plan your stay around this.",
    },
  ],
  "health-screening": [
    {
      q: "Can I get results the same day?",
      a: "Most executive screening packages deliver a same-day specialist consultation covering your results, with detailed lab reports following within 48 hours.",
    },
  ],
  "tcm-wellness": [
    {
      q: "Is TCM treatment covered by international insurance?",
      a: "Coverage varies by insurer — we provide itemized invoices suitable for reimbursement claims, but coverage confirmation is your insurer's decision.",
    },
  ],
};

export default async function SpecialtyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);
  if (!specialty) notFound();

  const matchingHospitals = hospitals.filter((h) =>
    h.specialties.includes(specialty.name)
  );
  const faqs = faqBySpecialty[specialty.slug] ?? [];

  return (
    <>
      <PageHero eyebrow="Specialty" title={specialty.name} description={specialty.blurb} />
      <Container className="flex flex-col gap-10 py-10">
        <section>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            Hospitals offering {specialty.name}
          </h2>
          {matchingHospitals.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matchingHospitals.map((h) => (
                <HospitalCard key={h.slug} hospital={h} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">
              No hospitals currently listed for this specialty — check back soon.
            </p>
          )}
        </section>

        {faqs.length > 0 ? (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Common questions</h2>
            <div className="flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="rounded-[10px] border border-neutral-300 bg-white p-4"
                >
                  <summary className="cursor-pointer font-semibold text-neutral-900">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-neutral-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}

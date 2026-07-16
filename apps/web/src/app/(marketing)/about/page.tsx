import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";

export const metadata: Metadata = {
  title: "About Us",
  description: "Our mission: a transparent, coordinated path to world-class treatment in China.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A single point of accountability for international medical travel"
        description="We started Asia Health Link and Travel because patients deserved better than fragmented, unlicensed 'medical broker' arrangements."
      />
      <Container className="flex flex-col gap-10 py-10">
        <section>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">Our mission</h2>
          <p className="max-w-2xl text-neutral-700">
            International patients seeking treatment in China faced a broken process:
            no transparent pricing, no accountable coordination between hospital, visa,
            and travel logistics, and no single point of contact through a stressful
            journey. We built a platform that puts a curated network of accredited
            hospitals, a dedicated case manager, and transparent pricing behind every
            booking.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {[
            { stat: "15+", label: "Accredited partner hospitals" },
            { stat: "500+", label: "Patients served" },
            { stat: "3", label: "Destination cities" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[10px] border border-neutral-300 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary-700">{s.stat}</p>
              <p className="mt-1 text-sm text-neutral-600">{s.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">
            Accreditation partnerships
          </h2>
          <p className="max-w-2xl text-neutral-700">
            Every hospital in our network holds current JCI or national tertiary-grade
            accreditation, verified before listing and re-checked annually.
          </p>
        </section>
      </Container>
    </>
  );
}

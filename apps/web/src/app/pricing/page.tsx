import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";
import { Button } from "@/components/Button";
import { hospitals } from "@/data/hospitals";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Illustrative treatment package pricing by specialty across our partner hospitals.",
};

export default function PricingPage() {
  const packages = hospitals.flatMap((h) =>
    h.packages.map((p) => ({ ...p, hospitalName: h.name, hospitalSlug: h.slug }))
  );

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent, estimate-first pricing"
        description="Every price below is an illustrative range. Your actual cost is confirmed in writing by the hospital after reviewing your specific case."
      />
      <Container className="py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.name + pkg.hospitalSlug}
              className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm"
            >
              <span className="w-fit rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
                {pkg.specialty}
              </span>
              <h2 className="font-bold text-neutral-900">{pkg.name}</h2>
              <p className="text-sm text-neutral-500">{pkg.hospitalName}</p>
              <p className="text-lg font-bold text-primary-700">
                ${pkg.priceRangeUsd[0].toLocaleString()}–${pkg.priceRangeUsd[1].toLocaleString()}
              </p>
              <p className="text-sm text-neutral-600">{pkg.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[10px] border border-neutral-300 bg-neutral-100 p-6">
          <h2 className="mb-2 font-bold text-neutral-900">What&apos;s typically included</h2>
          <ul className="grid gap-1.5 text-sm text-neutral-700 sm:grid-cols-2">
            <li>Pre-treatment diagnostics reviewed by your care team</li>
            <li>The procedure or treatment course itself</li>
            <li>Standard recovery stay at the hospital</li>
            <li>A follow-up consultation before discharge</li>
          </ul>
          <p className="mt-3 text-sm text-neutral-600">
            Hotel stays, airport transfers, interpreters, and visa service fees are
            quoted separately based on your itinerary — see your personalized invoice
            once your application is accepted.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-[10px] bg-primary-600 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Want a personalized estimate?</h2>
          <p className="max-w-md text-primary-100">
            Submit your case details and a hospital will respond with exact pricing
            for your situation.
          </p>
          <Button href="/hospitals" variant="accent" size="lg">
            Start Your Application
          </Button>
        </div>
      </Container>
    </>
  );
}

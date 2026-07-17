import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";
import { Button } from "@/components/Button";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "How It Works",
    description: "The full patient journey, from first inquiry to your flight home.",
    path: "/how-it-works",
    locale,
  });
}

const steps = [
  {
    title: "1. Apply",
    body: "Browse hospitals by specialty and city, or tell us your condition and we'll suggest a match. Submit an application with your medical history and any existing diagnostic reports — no account required to start.",
  },
  {
    title: "2. Get Matched",
    body: "Your chosen hospital reviews your case, typically within 3 business days, and responds with a treatment plan and a transparent cost estimate. A dedicated case manager is assigned once you're accepted.",
  },
  {
    title: "3. Confirm & Prepare",
    body: "Pay a booking deposit to confirm your slot. We prepare your invitation letter for the medical visa application and help you gather the required documents.",
  },
  {
    title: "4. Book Your Trip",
    body: "Book a hotel near your hospital and an airport transfer directly through the platform — or arrange your own and we'll coordinate around it.",
  },
  {
    title: "5. Travel & Treat",
    body: "Your driver meets you at the airport, an interpreter accompanies your hospital visits if needed, and your case manager stays reachable throughout treatment.",
  },
  {
    title: "6. Recover & Follow Up",
    body: "After discharge, your case manager checks in at defined intervals, and you can request follow-up care through the same case if needed.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="Your treatment journey, coordinated end to end"
        description="Every step — medical, visa, and travel — runs through one case, with one point of contact."
      />
      <Container className="py-10">
        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 font-bold text-neutral-900">{step.title}</h2>
              <p className="text-neutral-700">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 rounded-[10px] bg-primary-100 p-8 text-center">
          <h2 className="text-xl font-bold text-neutral-900">Ready to begin?</h2>
          <Button href="/hospitals" size="lg">
            Find a Hospital
          </Button>
        </div>
      </Container>
    </>
  );
}

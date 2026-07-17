import { Container, PageHero } from "@/components/Section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to common questions about applying, visas, payments, and travel.",
  path: "/faq",
});

const faqGroups = [
  {
    category: "Applying",
    items: [
      {
        q: "Do I need an account to get a cost estimate?",
        a: "No — you can submit a general inquiry without an account. You'll need to register once you're ready to submit a full application with medical records.",
      },
      {
        q: "How long until a hospital responds to my application?",
        a: "Hospitals respond within 3 business days on average. Urgent cases (e.g., oncology) are flagged for priority same-business-day handling where possible.",
      },
    ],
  },
  {
    category: "Visa",
    items: [
      {
        q: "Can you guarantee my visa will be approved?",
        a: "No — visa approval is solely at the discretion of your country's Chinese consulate. We prepare your invitation letter and supporting documents, but the decision is theirs.",
      },
      {
        q: "How long does the invitation letter take to prepare?",
        a: "Typically within a few business days of your deposit payment being received and your hospital's formal acceptance.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "When will I find out the cost of my treatment?",
        a: "We don't publish prices online — every case is different. Your case manager shares a written cost estimate once the hospital has reviewed your specific condition.",
      },
      {
        q: "What happens if I need to cancel?",
        a: "Refund eligibility depends on how close you are to your treatment date — see our Terms of Service for the full cancellation policy.",
      },
    ],
  },
  {
    category: "Travel",
    items: [
      {
        q: "Can I book my own flights and hotel?",
        a: "Yes — hotel and airport-transfer booking through the platform is optional. If you arrange your own, just let your case manager know so your itinerary stays accurate.",
      },
      {
        q: "Will someone meet me at the airport?",
        a: "Yes, if you book an airport transfer — your driver receives your flight details and contact information ahead of arrival.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <Container className="flex flex-col gap-10 py-10">
        {faqGroups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 text-lg font-bold text-neutral-900">{group.category}</h2>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="rounded-[10px] border border-neutral-300 bg-white p-4"
                >
                  <summary className="cursor-pointer font-semibold text-neutral-900">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm text-neutral-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-sm text-neutral-600">
          Still need help?{" "}
          <a href="/contact" className="font-semibold text-primary-700 underline">
            Contact our team
          </a>
          .
        </p>
      </Container>
    </>
  );
}

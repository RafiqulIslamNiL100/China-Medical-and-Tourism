import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the Asia Health Link and Travel platform.",
};

const sections = [
  {
    title: "1. Description of Service",
    body: "Asia Health Link and Travel is a facilitation and coordination service. We connect patients with independent, licensed hospitals and doctors in China, and help coordinate related travel logistics and visa-documentation support. We do not provide medical care, diagnosis, or treatment ourselves.",
  },
  {
    title: "2. Medical Disclaimer",
    body: "Any treatment plans, cost estimates, or medical information you receive originate from the partner hospital or doctor, not the platform. We do not guarantee any specific medical outcome, treatment availability, or final pricing beyond what is confirmed in writing by the treating hospital.",
  },
  {
    title: "3. Visa & Travel Disclaimer",
    body: "We assist in preparing documentation to support your visa application, but visa approval is solely at the discretion of the relevant immigration authority. We do not control and cannot guarantee approval.",
  },
  {
    title: "4. Bookings, Fees & Payment",
    body: "Prices displayed are estimates until confirmed in writing by the relevant provider. A booking is confirmed only upon successful payment of the required deposit. Refunds and cancellations are governed by our Cancellation & Refund Policy, available in your account dashboard at checkout.",
  },
  {
    title: "5. Partner Hospitals & Service Providers",
    body: "Partner hospitals, doctors, hotels, drivers, and interpreters are independent third parties, not employees or agents of the platform. We vet partners for credentials but do not warrant the performance or outcomes of any independent partner.",
  },
  {
    title: "6. Limitation of Liability",
    body: "The platform is provided 'as is.' To the maximum extent permitted by law, our total liability for any claim is limited to the platform service fees you paid in the twelve months preceding the claim, and we are not liable for indirect or consequential damages including medical outcomes or visa denial.",
  },
  {
    title: "7. Termination",
    body: "We may suspend or terminate your account for violation of these Terms, fraudulent activity, or misuse of the platform. You may close your account at any time, subject to completion of active bookings.",
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <Container className="max-w-3xl py-10">
        <div className="mb-8 rounded-[10px] border border-warning-600/30 bg-warning-100 p-4 text-sm text-neutral-800">
          <strong>Draft notice:</strong> This page summarizes our terms for
          product-planning purposes. The full Terms of Service, reviewed by legal
          counsel, will be published here before public launch.
        </div>
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-2 font-bold text-neutral-900">{s.title}</h2>
              <p className="text-neutral-700">{s.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}

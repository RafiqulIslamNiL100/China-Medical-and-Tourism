import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How China Medical and Tourism collects, uses, and protects your information.",
};

const sections = [
  {
    title: "1. Introduction",
    body: "China Medical and Tourism connects international patients with hospitals in China and coordinates related travel services. This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices you have. Because we process health-related information, a sensitive category of data, we apply heightened safeguards throughout.",
  },
  {
    title: "2. Information We Collect",
    body: "Account information (name, email, phone), identity documents (passport details), health information (medical history, diagnostic reports, treatment records), payment billing details, in-platform communications, and travel details such as flight information and emergency contacts.",
  },
  {
    title: "3. How We Use Your Information",
    body: "To create and manage your account, match you with hospitals, prepare visa documentation, arrange hotel and transfer bookings, process payments, and communicate about your case. We never use health information for advertising or sell it to third parties.",
  },
  {
    title: "4. Who We Share Information With",
    body: "Your treating hospital/doctor, your assigned case manager, hotel and transport partners you book with, our payment processor, and immigration authorities as required for visa support. Partners are contractually bound to protect your data — we do not sell personal information.",
  },
  {
    title: "5. International Data Transfers",
    body: "Because our services connect patients across borders with hospitals in China, personal data may be transferred to and processed in China and other jurisdictions. Where required by applicable law, we use approved transfer mechanisms and only transfer the minimum data necessary.",
  },
  {
    title: "6. Data Retention",
    body: "Account and case data is retained for the duration of your relationship with the platform plus a defined period for legal and financial record-keeping. Identity and medical documents are retained only as long as necessary, then securely deleted.",
  },
  {
    title: "7. Your Rights",
    body: "Depending on your jurisdiction, you may have the right to access, correct, delete, restrict, or port your personal information, and to withdraw consent at any time. Contact us to exercise these rights.",
  },
  {
    title: "8. Security",
    body: "We apply encryption in transit and at rest, role-based access control, and audit logging of document access. No system is completely secure; we will notify affected users of a data breach as required by law.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Container className="max-w-3xl py-10">
        <div className="mb-8 rounded-[10px] border border-warning-600/30 bg-warning-100 p-4 text-sm text-neutral-800">
          <strong>Draft notice:</strong> This page summarizes our privacy practices and is
          provided for product-planning purposes. The full policy, reviewed by legal
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

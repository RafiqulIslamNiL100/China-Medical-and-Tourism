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
    title: "Contact",
    description: "Get in touch with our team before starting an application.",
    path: "/contact",
    locale,
  });
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our team"
        description="Have a question before applying? Send us a message and a case coordinator will respond within one business day."
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <form className="flex flex-col gap-4 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="specialty" className="text-sm font-semibold text-neutral-900">
              Specialty of interest (optional)
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              placeholder="e.g. Cardiology"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-sm font-semibold text-neutral-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" className="w-fit">
            Send message
          </Button>
        </form>

        <aside className="flex flex-col gap-4 text-sm text-neutral-700">
          <div>
            <h2 className="font-bold text-neutral-900">Response time</h2>
            <p className="mt-1">Within 1 business day for general inquiries.</p>
          </div>
          <div>
            <h2 className="font-bold text-neutral-900">Office hours</h2>
            <p className="mt-1">Monday–Saturday, 9:00–18:00 CST</p>
          </div>
        </aside>
      </Container>
    </>
  );
}

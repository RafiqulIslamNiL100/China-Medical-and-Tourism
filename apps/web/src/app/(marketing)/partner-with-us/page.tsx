import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Join our network as a hospital, hotel, or logistics partner.",
};

export default function PartnerWithUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With Us"
        title="Grow with our international patient network"
        description="We work with accredited hospitals, hotels, and travel partners to deliver a coordinated experience for every patient."
      />
      <Container className="grid gap-6 py-10 sm:grid-cols-2">
        <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-2 font-bold text-neutral-900">For hospitals</h2>
          <p className="text-sm text-neutral-600">
            Reach a qualified pipeline of international patients without building your
            own outbound marketing. We handle discovery, initial screening, and travel
            logistics — you focus on care.
          </p>
        </div>
        <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-2 font-bold text-neutral-900">For hotels &amp; transport partners</h2>
          <p className="text-sm text-neutral-600">
            Fill rooms and trips with a steady, coordinated stream of medical-travel
            bookings — with clear scheduling handled by our case management team.
          </p>
        </div>
      </Container>
      <Container className="pb-16">
        <form className="mx-auto flex max-w-xl flex-col gap-4 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-neutral-900">Apply to partner</h2>
          <div className="flex flex-col gap-1">
            <label htmlFor="org" className="text-sm font-semibold text-neutral-900">
              Organization name
            </label>
            <input
              id="org"
              name="org"
              type="text"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-semibold text-neutral-900">
              Partner type
            </label>
            <select
              id="type"
              name="type"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            >
              <option>Hospital</option>
              <option>Hotel</option>
              <option>Transport / Driver</option>
              <option>Interpreter</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Contact email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit">Submit application</Button>
        </form>
      </Container>
    </>
  );
}

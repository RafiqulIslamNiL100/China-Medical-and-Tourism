import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/Section";
import { Badge, VerifiedBadge } from "@/components/Badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/Button";
import { cities } from "@/data/hospitals";
import { searchHospitals, getHospital, listHospitalReviews } from "@/lib/api";

const markdownComponents = {
  h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-neutral-900 first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-neutral-900 first:mt-0" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-2 font-bold text-neutral-900" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className="mb-3 text-neutral-700" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-3 ml-5 list-disc text-neutral-700" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-3 ml-5 list-decimal text-neutral-700" {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="mb-1" {...props} />,
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-neutral-900" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a className="font-semibold text-primary-700 hover:underline" {...props} />
  ),
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 overflow-x-auto rounded-[10px] border border-neutral-300">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
    <thead className="border-b border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 uppercase" {...props} />
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => <th className="px-4 py-3" {...props} />,
  td: (props: React.ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-neutral-100 px-4 py-3 align-top text-neutral-700 last:border-0" {...props} />
  ),
};

async function findHospitalBySlug(slug: string) {
  const { data } = await searchHospitals();
  const match = data.find((h) => h.slug === slug);
  if (!match) return null;
  return getHospital(match.id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hospital = await findHospitalBySlug(slug);
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
  const hospital = await findHospitalBySlug(slug);
  if (!hospital) notFound();

  const reviews = await listHospitalReviews(hospital.id);

  const cityLabel = cities.find((c) => c.slug === hospital.citySlug)?.name ?? hospital.citySlug;

  return (
    <>
      <section className="border-b border-neutral-300/70 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <Container className="flex flex-col gap-4 py-12">
          <VerifiedBadge label="Verified Hospital" />
          <h1 className="text-3xl font-bold sm:text-4xl">{hospital.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-100">
            <span>{cityLabel}, China</span>
            <span className="text-white">
              <Stars rating={Number(hospital.rating)} />
            </span>
            <span>{hospital.reviewCount} reviews</span>
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
            ...(hospital.richProfileMarkdown ? [["#profile", "Full Profile"]] : []),
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

          {hospital.richProfileMarkdown ? (
            <section id="profile" className="scroll-mt-32">
              <h2 className="mb-3 text-xl font-bold text-neutral-900">Full Profile</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {hospital.richProfileMarkdown}
              </ReactMarkdown>
            </section>
          ) : null}

          <section id="reviews" className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Patient reviews</h2>
            <div className="flex flex-col gap-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-neutral-500">No published reviews yet.</p>
              ) : null}
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <Badge tone="primary">Verified Patient</Badge>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
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

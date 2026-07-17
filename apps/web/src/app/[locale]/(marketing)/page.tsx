import type { Metadata } from "next";
import { connection } from "next/server";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Section";
import { HospitalCard } from "@/components/HospitalCard";
import { TreatmentsSearchInput } from "@/components/TreatmentsSearchInput";
import { Stars } from "@/components/Stars";
import { Badge } from "@/components/Badge";
import { hospitals, specialties, testimonials } from "@/data/hospitals";
import { listSpecialties, listCities, listArticles } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { fmtDate } from "@/lib/format";
import { T, type DictKey } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Asia Health Link & Travel — Coordinated Treatment & Visit in China",
    description:
      "Book world-class treatment at accredited hospitals in China, with visa support, hotel booking, and airport transfers coordinated in one place.",
    path: "/",
    absoluteTitle: true,
    locale,
  });
}

const steps: { titleKey: DictKey; bodyKey: DictKey }[] = [
  { titleKey: "howItWorks.apply.title", bodyKey: "howItWorks.apply.body" },
  { titleKey: "howItWorks.matched.title", bodyKey: "howItWorks.matched.body" },
  { titleKey: "howItWorks.travel.title", bodyKey: "howItWorks.travel.body" },
  { titleKey: "howItWorks.recover.title", bodyKey: "howItWorks.recover.body" },
];

export default async function HomePage() {
  // Keep the homepage dynamically rendered rather than statically prerendered at
  // build time — see the matching comment in destinations/page.tsx for why.
  await connection();
  const featured = hospitals.slice(0, 3);
  const topReviews = testimonials.slice(0, 3);
  const allSpecialties = await listSpecialties();
  const treatmentPreview = allSpecialties.slice(0, 8);
  const destinationCities = await listCities();
  const latestArticles = (await listArticles()).slice(0, 3);

  return (
    <>
      <section className="border-b border-neutral-300/70 bg-gradient-to-b from-primary-100/70 to-white">
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
              <T k="hero.badge" />
            </span>
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              <T k="hero.title" />
            </h1>
            <p className="max-w-lg text-lg text-neutral-700">
              <T k="hero.description" />
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/app/apply" size="lg">
                <T k="hero.startApplication" />
              </Button>
              <Button href="/how-it-works" size="lg" variant="secondary">
                <T k="hero.howItWorks" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-neutral-500">
              <span>
                <strong className="text-neutral-900">500+</strong> <T k="hero.patientsServed" />
              </span>
              <span>
                <strong className="text-neutral-900">10+</strong> <T k="hero.destinationCities" />
              </span>
              <span>
                <strong className="text-neutral-900">4.7+</strong> <T k="hero.averageRating" />
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {specialties.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}`}
                className="flex flex-col gap-1 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="font-bold text-neutral-900">{s.name}</span>
                <span className="text-xs text-neutral-500">{s.blurb}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-neutral-300/70 bg-neutral-100 py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                <T k="treatments.heading" />
              </h2>
              <p className="text-neutral-500">
                <T k="treatments.subtitle" vars={{ count: allSpecialties.length }} />
              </p>
            </div>
            <Link href="/specialties" className="text-sm font-semibold text-primary-700">
              <T k="treatments.viewAll" />
            </Link>
          </div>
          <form action="/specialties" className="mb-8 flex max-w-md gap-2">
            <TreatmentsSearchInput />
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <T k="treatments.searchButton" />
            </button>
          </form>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {treatmentPreview.map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}`}
                className="flex flex-col gap-1 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="font-bold text-neutral-900">{s.name}</span>
                {s.blurb ? <span className="text-xs text-neutral-500">{s.blurb}</span> : null}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                <T k="hospitals.heading" />
              </h2>
              <p className="text-neutral-500">
                <T k="hospitals.subtitle" />
              </p>
            </div>
            <Link href="/hospitals" className="text-sm font-semibold text-primary-700">
              <T k="hospitals.viewAll" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((h) => (
              <HospitalCard key={h.slug} hospital={h} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-neutral-300/70 bg-neutral-100 py-16">
        <Container>
          <h2 className="mb-10 text-center text-2xl font-bold text-neutral-900">
            <T k="howItWorks.heading" />
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.titleKey} className="flex flex-col gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-bold text-neutral-900">
                  <T k={step.titleKey} />
                </h3>
                <p className="text-sm text-neutral-600">
                  <T k={step.bodyKey} />
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            What our patients say
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {topReviews.map((r) => (
              <div
                key={r.patientName + r.date}
                className="flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
              >
                <Stars rating={r.rating} />
                <p className="text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs font-semibold text-neutral-500">
                  {r.patientName} &middot; {r.country} &middot; {r.treatment}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-300/70 bg-neutral-100 py-16">
        <Container>
          <h2 className="mb-8 text-2xl font-bold text-neutral-900">
            Explore destinations
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {destinationCities.map((c) => (
              <Link
                key={c.slug}
                href={`/destinations/${c.slug}`}
                className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-bold text-neutral-900">{c.name}</h3>
                <p className="text-sm text-neutral-600">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {latestArticles.length > 0 ? (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-neutral-900">Latest from our blog</h2>
              <Link href="/blog" className="text-sm font-semibold text-primary-700">
                View all &rarr;
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {latestArticles.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {post.category ? <Badge tone="primary">{post.category}</Badge> : null}
                  <h3 className="font-bold text-neutral-900 group-hover:text-primary-700">
                    {post.title}
                  </h3>
                  {post.excerpt ? <p className="text-sm text-neutral-600">{post.excerpt}</p> : null}
                  <p className="mt-auto text-xs text-neutral-500">{fmtDate(post.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-primary-600 py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start your treatment journey?
          </h2>
          <p className="max-w-xl text-primary-100">
            Get matched with an accredited hospital and a dedicated case manager in as
            little as 48 hours.
          </p>
          <Button href="/register" variant="accent" size="lg">
            Get Started
          </Button>
        </Container>
      </section>
    </>
  );
}

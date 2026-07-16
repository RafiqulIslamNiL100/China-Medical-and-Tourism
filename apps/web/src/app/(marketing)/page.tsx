import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Section";
import { HospitalCard } from "@/components/HospitalCard";
import { Stars } from "@/components/Stars";
import { hospitals, specialties, cities, testimonials } from "@/data/hospitals";
import { listSpecialties } from "@/lib/api";

const steps = [
  {
    title: "Apply",
    body: "Tell us your condition and preferred hospital. No account required to get started.",
  },
  {
    title: "Get Matched",
    body: "A hospital reviews your case and sends back a personalized treatment plan.",
  },
  {
    title: "Travel & Treat",
    body: "We coordinate your visa, hotel, and airport transfer around your treatment dates.",
  },
  {
    title: "Recover",
    body: "Your case manager stays with you through discharge and follow-up care.",
  },
];

export default async function HomePage() {
  const featured = hospitals.slice(0, 3);
  const topReviews = testimonials.slice(0, 3);
  const allSpecialties = await listSpecialties();
  const treatmentPreview = allSpecialties.slice(0, 8);

  return (
    <>
      <section className="border-b border-neutral-300/70 bg-gradient-to-b from-primary-100/70 to-white">
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
              15+ accredited partner hospitals
            </span>
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              World-class treatment in China, fully coordinated.
            </h1>
            <p className="max-w-lg text-lg text-neutral-700">
              From your first inquiry to your flight home — hospital booking, visa
              support, hotels, and airport transfers, coordinated by one dedicated case
              manager.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/hospitals" size="lg">
                Find a Hospital
              </Button>
              <Button href="/how-it-works" size="lg" variant="secondary">
                How It Works
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-neutral-500">
              <span>
                <strong className="text-neutral-900">500+</strong> patients served
              </span>
              <span>
                <strong className="text-neutral-900">3</strong> destination cities
              </span>
              <span>
                <strong className="text-neutral-900">4.7</strong> average rating
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
              <h2 className="text-2xl font-bold text-neutral-900">Treatments</h2>
              <p className="text-neutral-500">
                {allSpecialties.length} specialties across our accredited hospital network.
              </p>
            </div>
            <Link href="/specialties" className="text-sm font-semibold text-primary-700">
              View all &rarr;
            </Link>
          </div>
          <form action="/specialties" className="mb-8 flex max-w-md gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search treatments (e.g. cardiology, IVF, neurosurgery)"
              className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Search
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
              <h2 className="text-2xl font-bold text-neutral-900">Featured hospitals</h2>
              <p className="text-neutral-500">
                Accredited partners across Beijing, Shanghai, and Guangzhou.
              </p>
            </div>
            <Link href="/hospitals" className="text-sm font-semibold text-primary-700">
              View all &rarr;
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
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-bold text-neutral-900">{step.title}</h3>
                <p className="text-sm text-neutral-600">{step.body}</p>
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
            {cities.map((c) => (
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

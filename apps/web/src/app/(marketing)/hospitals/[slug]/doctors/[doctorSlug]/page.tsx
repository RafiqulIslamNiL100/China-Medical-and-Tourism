import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { hospitals } from "@/data/hospitals";

export function generateStaticParams() {
  return hospitals.flatMap((h) =>
    h.doctors.map((d) => ({ slug: h.slug, doctorSlug: d.slug }))
  );
}

function findDoctor(slug: string, doctorSlug: string) {
  const hospital = hospitals.find((h) => h.slug === slug);
  const doctor = hospital?.doctors.find((d) => d.slug === doctorSlug);
  return { hospital, doctor };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; doctorSlug: string }>;
}): Promise<Metadata> {
  const { slug, doctorSlug } = await params;
  const { doctor } = findDoctor(slug, doctorSlug);
  if (!doctor) return {};
  return { title: doctor.name, description: doctor.bio };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string; doctorSlug: string }>;
}) {
  const { slug, doctorSlug } = await params;
  const { hospital, doctor } = findDoctor(slug, doctorSlug);
  if (!hospital || !doctor) notFound();

  const doctorReviews = hospital.reviews.filter(
    (r) => r.treatment.toLowerCase().includes(doctor.specialty.split(" ")[0].toLowerCase())
  );

  return (
    <Container className="py-12">
      <Link href={`/hospitals/${hospital.slug}`} className="text-sm font-semibold text-primary-700">
        &larr; {hospital.name}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
              {doctor.name
                .replace("Dr. ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{doctor.name}</h1>
              <p className="text-neutral-600">{doctor.specialty}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="primary">{doctor.yearsExperience} years experience</Badge>
            {doctor.languages.map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
          </div>

          <h2 className="mt-8 mb-2 font-bold text-neutral-900">Credentials</h2>
          <p className="text-sm text-neutral-700">{doctor.credentials}</p>

          <h2 className="mt-6 mb-2 font-bold text-neutral-900">About</h2>
          <p className="text-neutral-700">{doctor.bio}</p>

          {doctorReviews.length > 0 ? (
            <>
              <h2 className="mt-8 mb-4 font-bold text-neutral-900">Patient reviews</h2>
              <div className="flex flex-col gap-4">
                {doctorReviews.map((r) => (
                  <div
                    key={r.patientName + r.date}
                    className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                    <p className="mt-2 text-xs font-semibold text-neutral-500">
                      {r.patientName} &middot; {r.country}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <aside className="h-fit rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-neutral-900">Affiliated hospital</h3>
          <p className="mt-1 text-sm text-neutral-600">{hospital.name}</p>
          <p className="text-sm text-neutral-500">{hospital.cityLabel}, China</p>
          <Button href="/register" className="mt-4 w-full">
            Start Application with {doctor.name}
          </Button>
        </aside>
      </div>
    </Container>
  );
}

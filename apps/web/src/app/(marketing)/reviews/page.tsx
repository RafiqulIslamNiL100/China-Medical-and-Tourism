import { Container, PageHero } from "@/components/Section";
import { Stars } from "@/components/Stars";
import { Badge } from "@/components/Badge";
import { hospitals, testimonials } from "@/data/hospitals";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reviews",
  description: "Verified patient reviews across our accredited partner hospitals.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const avg =
    testimonials.reduce((sum, r) => sum + r.rating, 0) / testimonials.length;

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What patients say"
        description={`${testimonials.length} verified reviews across our partner hospitals — average rating ${avg.toFixed(1)} / 5.`}
      />
      <Container className="py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((r) => {
            const hospital = hospitals.find((h) => h.reviews.includes(r));
            return (
              <div
                key={r.patientName + r.date}
                className="flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <Badge tone="primary">Verified Patient</Badge>
                </div>
                <p className="text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-auto text-xs text-neutral-500">
                  <p className="font-semibold text-neutral-700">
                    {r.patientName} &middot; {r.country}
                  </p>
                  <p>
                    {r.treatment} at {hospital?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}

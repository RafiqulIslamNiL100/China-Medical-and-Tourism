import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { patientCases } from "@/data/patient";

export const metadata: Metadata = { title: "My Reviews" };

export default function PatientReviewsPage() {
  const eligible = patientCases.filter((c) => c.status === "Completed");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
      <p className="text-sm text-neutral-500">
        Share your experience once treatment is complete.
      </p>

      <div className="flex flex-col gap-3">
        {eligible.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-bold text-neutral-900">{c.hospitalName}</p>
              <p className="text-sm text-neutral-500">
                {c.specialty} &middot; Completed
              </p>
            </div>
            <Button size="sm" variant="secondary">
              Write a Review
            </Button>
          </div>
        ))}
        {eligible.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            You can leave a review once a treatment case is marked completed.
          </div>
        ) : null}
      </div>
    </div>
  );
}

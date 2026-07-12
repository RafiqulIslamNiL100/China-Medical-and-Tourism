import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Stars } from "@/components/Stars";
import { pendingReviews } from "@/data/admin";

export const metadata: Metadata = { title: "Review Moderation" };

export default function AdminReviewModerationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Review Moderation</h1>
      <p className="text-sm text-neutral-500">
        Reviews are held for moderation before appearing publicly.
      </p>

      <div className="flex flex-col gap-4">
        {pendingReviews.map((r) => (
          <div key={r.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <p className="text-xs text-neutral-500">{r.submittedDate}</p>
            </div>
            <p className="mt-2 text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold text-neutral-500">
              {r.patientName} &middot; {r.hospitalName}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="secondary">
                Redact
              </Button>
              <Button size="sm" variant="secondary">
                Reject
              </Button>
            </div>
          </div>
        ))}
        {pendingReviews.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            No pending reviews.
          </div>
        ) : null}
      </div>
    </div>
  );
}

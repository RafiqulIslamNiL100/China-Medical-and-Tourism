"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Stars } from "@/components/Stars";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { listPendingReviews, moderateReview, searchHospitals, ApiError, type Review } from "@/lib/api";

export default function AdminReviewModerationPage() {
  const { accessToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([listPendingReviews(accessToken), searchHospitals()])
      .then(([reviewsList, hospitals]) => {
        setReviews(reviewsList.filter((r) => r.status === "Pending"));
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleModerate(review: Review, decision: "Approve" | "Redact" | "Reject") {
    if (!accessToken) return;
    try {
      await moderateReview(accessToken, review.id, decision);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not moderate this review.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Review Moderation</h1>
      <p className="text-sm text-neutral-500">Reviews are held for moderation before appearing publicly.</p>
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <p className="text-xs text-neutral-500">{fmtDate(r.createdAt)}</p>
            </div>
            <p className="mt-2 text-sm text-neutral-700">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold text-neutral-500">{hospitalNames[r.hospitalId] ?? "Hospital"}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => handleModerate(r, "Approve")}>
                Approve
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleModerate(r, "Redact")}>
                Redact
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleModerate(r, "Reject")}>
                Reject
              </Button>
            </div>
          </div>
        ))}
        {reviews.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            No pending reviews.
          </div>
        ) : null}
      </div>
    </div>
  );
}

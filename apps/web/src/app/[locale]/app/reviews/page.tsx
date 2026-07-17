"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { listApplications, searchHospitals, submitReview, ApiError, type Application } from "@/lib/api";

export default function PatientReviewsPage() {
  const { accessToken } = useAuth();
  const [eligible, setEligible] = useState<Application[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<Application | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([listApplications(accessToken), searchHospitals()])
      .then(([apps, hospitals]) => {
        setEligible(apps.data.filter((c) => c.status === "Completed"));
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !reviewing) return;
    setError(null);
    try {
      await submitReview(accessToken, { applicationId: reviewing.id, rating, text });
      setSubmitted((prev) => new Set(prev).add(reviewing.id));
      setReviewing(null);
      setText("");
      setRating(5);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit review.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
      <p className="text-sm text-neutral-500">Share your experience once treatment is complete.</p>

      <div className="flex flex-col gap-3">
        {eligible.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-neutral-900">{hospitalNames[c.hospitalId] ?? "Hospital"}</p>
                <p className="text-sm text-neutral-500">{c.specialtySlug} &middot; Completed</p>
              </div>
              {submitted.has(c.id) ? (
                <span className="text-sm font-semibold text-success-600">Review submitted</span>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setReviewing(reviewing?.id === c.id ? null : c)}>
                  {reviewing?.id === c.id ? "Cancel" : "Write a Review"}
                </Button>
              )}
            </div>
            {reviewing?.id === c.id ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-neutral-100 pt-3">
                {error ? <p className="text-sm text-danger-700">{error}</p> : null}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-neutral-900">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} star{n === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell other patients about your experience..."
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
                <Button type="submit" size="sm" className="self-start">
                  Submit Review
                </Button>
              </form>
            ) : null}
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

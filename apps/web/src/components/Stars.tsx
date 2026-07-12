export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
      <span className="text-accent-600" aria-hidden="true">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

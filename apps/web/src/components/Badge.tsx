type BadgeTone = "neutral" | "info" | "warning" | "success" | "danger" | "primary";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700 border border-neutral-300",
  info: "bg-info-100 text-info-600",
  warning: "bg-warning-100 text-warning-600",
  success: "bg-success-100 text-success-600",
  danger: "bg-danger-100 text-danger-600",
  primary: "bg-primary-100 text-primary-700",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-primary-700 shadow-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l7 3v6c0 5-3.4 8.4-7 11-3.6-2.6-7-6-7-11V5l7-3z"
          fill="currentColor"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <path
        d="M100 10 L180 46 L180 112 C180 172 145 206 100 230 C55 206 20 172 20 112 L20 46 Z"
        fill="#0F6E5C"
      />
      <circle cx="100" cy="122" r="58" fill="none" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="6" />
      <rect x="89" y="86" width="22" height="72" rx="11" fill="#FFFFFF" />
      <rect x="64" y="111" width="72" height="22" rx="11" fill="#FFFFFF" />
    </svg>
  );
}

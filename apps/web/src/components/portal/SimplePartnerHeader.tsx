export function SimplePartnerHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm text-white">
            CMT
          </span>
          <div>
            <p className="text-sm font-bold text-neutral-900">{title}</p>
            <p className="text-xs text-neutral-500">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full bg-warning-100 px-2.5 py-1 text-[11px] font-semibold text-warning-600">
          Demo mode
        </span>
      </div>
    </header>
  );
}

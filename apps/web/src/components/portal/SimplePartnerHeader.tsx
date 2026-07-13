export function SimplePartnerHeader({
  title,
  subtitle,
  onLogout,
}: {
  title: string;
  subtitle: string;
  onLogout?: () => void;
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
        {onLogout ? (
          <button onClick={onLogout} className="text-sm font-semibold text-neutral-500 hover:text-neutral-900">
            Log out
          </button>
        ) : null}
      </div>
    </header>
  );
}

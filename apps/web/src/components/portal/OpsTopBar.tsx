import Link from "next/link";
import { currentCaseManager, opsCases } from "@/data/opsConsole";

const mobileNavItems = [
  { href: "/ops/queue", label: "Case Queue" },
  { href: "/ops/assignments", label: "Assignments" },
];

export function OpsTopBar() {
  const urgentCount = opsCases.filter((c) => c.slaRisk === "breached").length;

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">Operations Console</p>
          <p className="text-xs text-neutral-500">
            {currentCaseManager.name} &middot; {currentCaseManager.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden rounded-full bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-600 sm:inline-block">
            Demo mode — sample data
          </span>
          {urgentCount > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-danger-100 px-2.5 py-1 text-xs font-semibold text-danger-600">
              {urgentCount} SLA breached
            </span>
          ) : null}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {currentCaseManager.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-300/70 px-3 py-2 lg:hidden">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-primary-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

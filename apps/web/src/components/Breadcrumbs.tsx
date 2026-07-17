import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/structured-data";

/** One prop, two outputs: the visible trail and its BreadcrumbList JSON-LD, built
 * from the same `items` so they can't drift out of sync. Last item should have no
 * `href` — it's the current page.
 *
 * `tone="onDark"` for use on a colored/gradient hero (e.g. the hospital detail
 * page); defaults to neutral text for the usual light-background heroes. */
export function Breadcrumbs({
  items,
  tone = "default",
}: {
  items: BreadcrumbItem[];
  tone?: "default" | "onDark";
}) {
  const isOnDark = tone === "onDark";
  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(items)} />
      <nav aria-label="Breadcrumb" className={`text-sm ${isOnDark ? "text-white/70" : "text-neutral-500"}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 ? (
                <span aria-hidden="true" className={isOnDark ? "text-white/40" : "text-neutral-400"}>
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className={isOnDark ? "hover:text-white hover:underline" : "hover:text-primary-700 hover:underline"}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`font-medium ${isOnDark ? "text-white" : "text-neutral-900"}`}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

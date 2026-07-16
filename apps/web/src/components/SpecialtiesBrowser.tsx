"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SpecialtyWithCount = {
  slug: string;
  name: string;
  blurb?: string | null;
  count: number;
};

/** Client-side live filtering — the full specialty list is small (a few dozen),
 * so filtering in the browser as the user types is instant and avoids a
 * server round-trip (and full page reload) per keystroke. */
export function SpecialtiesBrowser({
  specialties,
  initialQuery,
}: {
  specialties: SpecialtyWithCount[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specialties;
    return specialties.filter((s) => s.name.toLowerCase().includes(q));
  }, [specialties, query]);

  return (
    <>
      <div className="mb-8 max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search specialties (e.g. cardiology, IVF, neurosurgery)"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link
            key={s.slug}
            href={`/specialties/${s.slug}`}
            className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-neutral-900">{s.name}</h2>
            {s.blurb ? <p className="text-sm text-neutral-600">{s.blurb}</p> : null}
            <p className="mt-2 text-xs font-semibold text-primary-700">
              {s.count} hospital{s.count === 1 ? "" : "s"} offering this specialty &rarr;
            </p>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="col-span-full text-sm text-neutral-500">No specialties match &ldquo;{query}&rdquo;.</p>
        ) : null}
      </div>
    </>
  );
}

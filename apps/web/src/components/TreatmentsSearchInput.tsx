"use client";

import { useLanguage } from "@/lib/i18n";

export function TreatmentsSearchInput() {
  const { t } = useLanguage();

  return (
    <input
      type="text"
      name="q"
      placeholder={t("treatments.searchPlaceholder")}
      className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
    />
  );
}

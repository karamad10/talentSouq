import { BadgeCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";

/**
 * Shown only for employers a TRIOVATE admin has vetted (the interim
 * verification process at launch; never self-awarded). Stand-in until the
 * trust pack's VerifiedBadge (components/VerifiedBadge.jsx) is dropped in:
 * same placement and meaning, tokens and Lucide only.
 */
export function VerifiedBadge({ locale, size = 15 }: { locale: Locale; size?: number }) {
  const label = locale === "ar" ? "صاحب عمل موثّق" : "Verified employer";
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex shrink-0 text-ts-primary">
      <BadgeCheck size={size} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

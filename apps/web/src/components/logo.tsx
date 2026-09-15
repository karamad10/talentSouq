import Link from "next/link";

/**
 * `compact` drops the wordmark once the bar around it runs out of room, leaving
 * the mark alone:
 *
 * - `"narrow"` below 380px — the public header, which only loses it on the
 *   smallest phones still in use.
 * - `"wide"` below 640px — the workspace app bar, which also has to fit an
 *   identity chip and two unread bells.
 */
export function Logo({ inverted = false, compact }: { inverted?: boolean; compact?: "narrow" | "wide" }) {
  return (
    <Link className="logo" data-inverted={inverted || undefined} data-compact={compact} href="/" aria-label="TalentSouq home">
      <span className="logo-mark" aria-hidden="true"><span>T</span></span>
      <span className="logo-type">Talent<span>Souq</span></span>
    </Link>
  );
}

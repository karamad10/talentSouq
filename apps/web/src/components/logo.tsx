import Image from "next/image";
import Link from "next/link";

/**
 * `compact` drops the wordmark once the bar around it runs out of room, leaving
 * the mark alone:
 *
 * - `"narrow"` below 380px — the public header, which only loses it on the
 *   smallest phones still in use.
 * - `"wide"` below 640px — the workspace app bar, which also has to fit an
 *   identity chip and two unread bells.
 *
 * The mark itself is the same brand SVG used for the mobile app's header
 * (`assets/brand/mark-light.svg` / `mark-ondark.svg` in the mobile repo) so
 * the two apps show one consistent icon.
 */
export function Logo({ inverted = false, compact }: { inverted?: boolean; compact?: "narrow" | "wide" }) {
  return (
    <Link className="logo" data-inverted={inverted || undefined} data-compact={compact} href="/" aria-label="TalentSouq home">
      <span className="logo-mark" aria-hidden="true">
        <Image src={inverted ? "/brand/mark-ondark.svg" : "/brand/mark-light.svg"} alt="" width={28} height={28} />
      </span>
      <span className="logo-type">Talent<span>Souq</span></span>
    </Link>
  );
}

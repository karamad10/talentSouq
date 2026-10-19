import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * The lockup: teal monogram tile + "TalentSouq" (Talent teal, Souq orange) +
 * "by Triovate", which links to triovate.ae. The home link and the Triovate
 * link are siblings, never nested.
 *
 * `compact` drops the words once the bar around it runs out of room, leaving
 * the tile alone:
 *
 * - `"narrow"` below 380px — the public header, which only loses it on the
 *   smallest phones still in use.
 * - `"wide"` below 640px — the workspace app bar, which also has to fit an
 *   identity chip and two unread bells.
 *
 * The tile is the app icon (public/brand/icon.svg, the same artwork as the
 * mobile app's icon), so site and app show one mark.
 */
export function Logo({ inverted = false, compact }: { inverted?: boolean; compact?: "narrow" | "wide" }) {
  return (
    <span className="logo" data-inverted={inverted || undefined} data-compact={compact}>
      <Link className="logo-mark" href="/" aria-label="TalentSouq home">
        <Image src="/brand/icon.svg" alt="" width={36} height={36} />
      </Link>
      <span className="logo-type">
        <Link href="/" tabIndex={-1} aria-hidden="true" className="logo-word">
          Talent<span>Souq</span>
        </Link>
        {/* The parent-brand signature, as on the app's welcome screen (report RPT-2026-014 §7). */}
        <a className="logo-sig" href={BRAND.parentUrl} target="_blank" rel="noopener">
          {BRAND.signature}
        </a>
      </span>
    </span>
  );
}

import { cn } from "@/lib/cn";
import { appLinks } from "@/lib/app-links";
import type { Locale } from "@/lib/i18n";

/**
 * The official App Store and Google Play badges, side by side. A launch
 * requirement on the hero, the footer and /download. Artwork is the stores'
 * own (public/badges); Apple's badge is used in English for both languages
 * because Apple publishes the Arabic one only through its badge tool.
 *
 * `size` sets the badge height: 40px is Apple's minimum on screen.
 */
export function StoreBadges({ locale, size = 44, className }: { locale: Locale; size?: 40 | 44 | 52; className?: string }) {
  const links = appLinks();
  const arabic = locale === "ar";
  // Both badges carry their own black field, so they read on light and dark grounds alike.
  const height = { 40: "h-10", 44: "h-11", 52: "h-13" }[size];
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={links.ios}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={arabic ? "حمّل تالنت سوق من App Store" : "Download TalentSouq on the App Store"}
        className="rounded-[9px] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ts-focus"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static vector badge, no optimisation to gain */}
        <img src="/badges/app-store-en.svg" alt="" className={cn(height, "w-auto")} />
      </a>
      <a
        href={links.android}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={arabic ? "حمّل تالنت سوق من Google Play" : "Get TalentSouq on Google Play"}
        className="rounded-[9px] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ts-focus"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static badge, no optimisation to gain */}
        <img src={arabic ? "/badges/google-play-ar.png" : "/badges/google-play-en.png"} alt="" className={cn(height, "w-auto")} />
      </a>
    </div>
  );
}

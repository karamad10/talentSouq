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
  const badges = [
    { key: "ios", href: links.ios, src: "/badges/app-store-en.svg", label: arabic ? "حمّل TalentSouq من App Store" : "Download TalentSouq on the App Store" },
    { key: "android", href: links.android, src: arabic ? "/badges/google-play-ar.png" : "/badges/google-play-en.png", label: arabic ? "حمّل TalentSouq من Google Play" : "Get TalentSouq on Google Play" }
  ];

  // Before approval the store pages 404: show the badges as "coming soon" and
  // send the visitor to create an account instead of to a dead store page.
  if (!links.live) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex flex-wrap items-center gap-3 opacity-60" aria-hidden="true">
          {badges.map((badge) => (
            // eslint-disable-next-line @next/next/no-img-element -- static badge artwork
            <img key={badge.key} src={badge.src} alt="" className={cn(height, "w-auto grayscale-[30%]")} />
          ))}
        </div>
        <p className="m-0 text-[13px] text-current opacity-80">
          {arabic ? "قريباً على App Store وGoogle Play. " : "Coming soon to the App Store and Google Play. "}
          <a href="/auth/login?mode=signup" className="font-semibold underline underline-offset-4">
            {arabic ? "أنشئ حسابك الآن" : "Create your account now"}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {badges.map((badge) => (
        <a
          key={badge.key}
          href={badge.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={badge.label}
          className="rounded-[9px] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ts-focus"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static badge artwork */}
          <img src={badge.src} alt="" className={cn(height, "w-auto")} />
        </a>
      ))}
    </div>
  );
}

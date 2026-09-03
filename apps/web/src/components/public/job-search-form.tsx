import { MapPin, Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * The public search bar. `tone="hero"` sits on the dark hero image; the default
 * sits on a page surface. Both submit as GET to /jobs, so results are shareable.
 */
export function JobSearchForm({
  locale,
  q = "",
  location = "",
  tone = "surface",
  className
}: {
  locale: Locale;
  q?: string;
  location?: string;
  tone?: "hero" | "surface";
  className?: string;
}) {
  const hero = tone === "hero";
  const field = cn(
    "flex h-14 min-w-0 flex-1 items-center gap-3 rounded-ts-md px-4 transition-colors",
    hero ? "bg-white/10 text-white focus-within:bg-white/15" : "border border-ts-field bg-ts-surface focus-within:border-ts-primary"
  );
  const input = cn(
    "min-w-0 flex-1 border-0 bg-transparent text-[15px] outline-none",
    hero ? "text-white placeholder:text-white/60" : "text-ts-ink placeholder:text-ts-muted"
  );

  return (
    <form
      action="/jobs"
      role="search"
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-ts-lg p-3",
        hero ? "border border-white/15 bg-white/5 backdrop-blur" : "border border-ts-line bg-ts-surface-2/50",
        className
      )}
    >
      <label className={field}>
        <Search size={19} aria-hidden="true" className={hero ? "shrink-0 text-white/70" : "shrink-0 text-ts-muted"} />
        <span className="sr-only">{locale === "ar" ? "ابحث عن وظائف" : "Search jobs"}</span>
        <input name="q" defaultValue={q} placeholder={locale === "ar" ? "المسمى الوظيفي أو الشركة" : "Role, skill, or company"} className={input} />
      </label>
      <label className={cn(field, "max-w-64 min-[900px]:max-w-72")}>
        <MapPin size={19} aria-hidden="true" className={hero ? "shrink-0 text-white/70" : "shrink-0 text-ts-muted"} />
        <span className="sr-only">{locale === "ar" ? "الموقع" : "Location"}</span>
        <input name="location" defaultValue={location} placeholder={locale === "ar" ? "المدينة أو الدولة" : "City, country, or remote"} className={input} />
      </label>
      <button
        type="submit"
        className={cn(
          "inline-flex h-14 shrink-0 items-center gap-2 rounded-ts-md px-7 text-[15px] font-bold transition-transform hover:-translate-y-0.5",
          hero ? "bg-ts-accent text-[#1d2525]" : "bg-ts-primary text-white"
        )}
      >
        {locale === "ar" ? "بحث" : "Search jobs"}
      </button>
    </form>
  );
}

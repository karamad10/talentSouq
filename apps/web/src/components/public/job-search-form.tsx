import { MapPin, Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * The public search bar: one soft card holding two fields and the action, so it
 * reads as a single object on both the home hero and the results page. Submits
 * as GET to /jobs, so results are shareable.
 */
export function JobSearchForm({
  locale,
  q = "",
  location = "",
  className
}: {
  locale: Locale;
  q?: string;
  location?: string;
  className?: string;
}) {
  // Below 700px the fields stack: side by side they collapse to icon-width stubs
  // long before the placeholder is readable.
  const field =
    "flex h-12 w-full min-w-0 items-center gap-2.5 rounded-full border border-ts-line bg-ts-paper px-4 transition-colors focus-within:border-ts-primary min-[700px]:w-auto min-[700px]:flex-1 min-[700px]:border-transparent min-[700px]:bg-transparent min-[700px]:focus-within:border-transparent";
  const input = "min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ts-ink outline-none placeholder:text-ts-subtle";

  return (
    <form
      action="/jobs"
      role="search"
      className={cn(
        "flex max-w-2xl flex-col items-stretch gap-2 rounded-ts-xl border border-ts-line bg-ts-surface p-2 shadow-ts-card transition-shadow focus-within:shadow-ts-lift min-[700px]:flex-row min-[700px]:items-center min-[700px]:rounded-full",
        className
      )}
    >
      <label className={field}>
        <Search size={18} aria-hidden="true" className="shrink-0 text-ts-subtle" />
        <span className="sr-only">{locale === "ar" ? "ابحث عن وظائف" : "Search jobs"}</span>
        <input name="q" defaultValue={q} placeholder={locale === "ar" ? "المسمى الوظيفي أو الشركة" : "Role, skill, or company"} className={input} />
      </label>
      <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-ts-line min-[700px]:block" />
      <label className={cn(field, "min-[700px]:max-w-56")}>
        <MapPin size={18} aria-hidden="true" className="shrink-0 text-ts-subtle" />
        <span className="sr-only">{locale === "ar" ? "الموقع" : "Location"}</span>
        <input name="location" defaultValue={location} placeholder={locale === "ar" ? "المدينة أو الدولة" : "City, country, or remote"} className={input} />
      </label>
      <button
        type="submit"
        className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-ts-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ts-primary-deep min-[700px]:w-auto"
      >
        {locale === "ar" ? "بحث" : "Search jobs"}
      </button>
    </form>
  );
}

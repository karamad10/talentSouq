import type { Metadata } from "next";
import { Search, X } from "lucide-react";
import type { Route } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicJobCard } from "@/components/public/job-card";
import { JobSearchForm } from "@/components/public/job-search-form";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Find jobs", description: "Explore open opportunities across the Gulf." };

type JobsSearchParams = { q?: string; location?: string; category?: string; mode?: string; type?: string; sort?: string };

export default async function JobsPage({ searchParams }: { searchParams: Promise<JobsSearchParams> }) {
  const [params, cookieStore, user] = await Promise.all([searchParams, cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const arabic = locale === "ar";

  const q = (params.q ?? "").trim();
  const location = (params.location ?? "").trim();
  const category = params.category ?? "";
  const mode = params.mode ?? "";
  const type = params.type ?? "";
  const sort = params.sort ?? "recent";
  const keyword = q.toLowerCase();
  const place = location.toLowerCase();

  const results = jobs
    .filter((job) => !keyword || `${job.title} ${job.company} ${job.category} ${job.skills.join(" ")}`.toLowerCase().includes(keyword))
    .filter((job) => !place || `${job.location} ${job.country} ${job.mode}`.toLowerCase().includes(place))
    .filter((job) => !category || job.category === category)
    .filter((job) => !mode || job.mode === mode)
    .filter((job) => !type || job.type === type)
    .sort((a, b) => (sort === "salary" ? b.salaryMax - a.salaryMax : a.postedDays - b.postedDays));

  const categories = [...new Set(jobs.map((job) => job.category))];
  const modes = [...new Set(jobs.map((job) => job.mode))];
  const types = [...new Set(jobs.map((job) => job.type))];
  const hasFilters = Boolean(q || location || category || mode || type);

  /** Keeps the current search while toggling one facet on or off. */
  const facetHref = (key: "category" | "mode" | "type", value: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (location) search.set("location", location);
    if (category && key !== "category") search.set("category", category);
    if (mode && key !== "mode") search.set("mode", mode);
    if (type && key !== "type") search.set("type", type);
    const current = key === "category" ? category : key === "mode" ? mode : type;
    if (current !== value) search.set(key, value);
    if (sort !== "recent") search.set("sort", sort);
    const qs = search.toString();
    return (qs ? `/jobs?${qs}` : "/jobs") as Route;
  };

  const sortHref = (value: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (location) search.set("location", location);
    if (category) search.set("category", category);
    if (mode) search.set("mode", mode);
    if (type) search.set("type", type);
    if (value !== "recent") search.set("sort", value);
    const qs = search.toString();
    return (qs ? `/jobs?${qs}` : "/jobs") as Route;
  };

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-primary uppercase">{arabic ? "فرصتك القادمة" : "Your next opportunity"}</p>
          <h1 className="m-0 mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">
            {arabic ? "اعثر على عمل يناسب طموحك." : "Find work that fits your ambition."}
          </h1>
          <p className="m-0 mt-4 max-w-2xl text-[17px] leading-relaxed text-ts-muted">
            {arabic ? `${jobs.length} فرصة مفتوحة من فرق متنامية في الخليج.` : `${jobs.length} open roles from growing teams across the Gulf, updated every day.`}
          </p>
          <JobSearchForm locale={locale} q={q} location={location} className="mt-8" />
        </Container>
      </section>

      {/* Facets: plain links, so every filtered view has its own shareable URL. */}
      <section className="sticky top-0 z-20 border-b border-ts-line bg-ts-paper/95 py-4 backdrop-blur">
        <Container className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <FacetRow label={arabic ? "المجال" : "Function"} values={categories} active={category} href={(value) => facetHref("category", value)} />
          <FacetRow label={arabic ? "نمط العمل" : "Work mode"} values={modes} active={mode} href={(value) => facetHref("mode", value)} />
          <FacetRow label={arabic ? "نوع العقد" : "Contract"} values={types} active={type} href={(value) => facetHref("type", value)} />
          {hasFilters ? (
            <Link href="/jobs" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink">
              <X size={14} aria-hidden="true" /> {arabic ? "مسح الكل" : "Clear all"}
            </Link>
          ) : null}
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">
                {results.length} {arabic ? "وظيفة" : results.length === 1 ? "open role" : "open roles"}
              </h2>
              <p className="m-0 mt-1.5 text-[15px] text-ts-muted">
                {q || location
                  ? `${arabic ? "نتائج" : "Results for"} ${[q, location].filter(Boolean).join(" · ")}`
                  : arabic
                    ? "فرص مختارة من شركات متنامية"
                    : "Curated opportunities from growing teams"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-ts-muted">{arabic ? "ترتيب" : "Sort"}</span>
              {[
                { value: "recent", label: arabic ? "الأحدث" : "Newest" },
                { value: "salary", label: arabic ? "الأعلى راتباً" : "Top salary" }
              ].map((option) => (
                <Link
                  key={option.value}
                  href={sortHref(option.value)}
                  aria-current={sort === option.value ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-[13px] font-bold transition-colors",
                    sort === option.value ? "bg-ts-primary-tint text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
                  )}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {results.length > 0 ? (
            <div className="mt-8 grid gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {results.map((job) => (
                <PublicJobCard key={job.id} job={job} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-ts-lg border border-dashed border-ts-line px-6 py-16 text-center">
              <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-ts-surface-2 text-ts-muted">
                <Search size={24} />
              </span>
              <h3 className="m-0 text-xl font-bold text-ts-ink">{arabic ? "لا توجد نتائج" : "No roles found"}</h3>
              <p className="m-0 max-w-md text-[15px] text-ts-muted">
                {arabic ? "جرّب مسمى وظيفي أو موقعاً أوسع." : "Try a broader title, company, or location — or clear the filters."}
              </p>
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center rounded-full border border-ts-line bg-ts-surface px-5 text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
              >
                {arabic ? "مسح الكل" : "Clear filters"}
              </Link>
            </div>
          )}
        </Container>
      </section>

      <CtaBand locale={locale} />
      <PublicFooter locale={locale} />
    </main>
  );
}

function FacetRow({ label, values, active, href }: { label: string; values: string[]; active: string; href: (value: string) => Route }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{label}</span>
      {values.map((value) => (
        <Link
          key={value}
          href={href(value)}
          aria-pressed={active === value}
          className={cn(
            "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
            active === value
              ? "border-ts-primary bg-ts-primary text-white"
              : "border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
          )}
        >
          {value}
        </Link>
      ))}
    </div>
  );
}

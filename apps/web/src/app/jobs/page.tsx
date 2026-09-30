import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicJobCard } from "@/components/public/job-card";
import { JobSearchForm } from "@/components/public/job-search-form";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { listPublicJobs, type Facet } from "@/data/public-jobs";
import { getSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import { categoryLabel, employmentTypeLabel, rolesCount, workModeLabel } from "@/lib/labels";
import { getPreferences } from "@/lib/locale";
import { Eyebrow, Stopped } from "@/components/brand-stop";

export const metadata: Metadata = { title: "Find jobs", description: "Explore open opportunities across the Gulf and Syria." };

const PAGE_SIZE = 24;

type JobsSearchParams = { q?: string; location?: string; category?: string; mode?: string; type?: string; sort?: string; page?: string };
type FacetKey = "category" | "mode" | "type";

export default async function JobsPage({ searchParams }: { searchParams: Promise<JobsSearchParams> }) {
  const [params, { locale, theme }, user] = await Promise.all([searchParams, getPreferences(), getSessionUser()]);
  const arabic = locale === "ar";

  const q = (params.q ?? "").trim().slice(0, 80);
  const location = (params.location ?? "").trim().slice(0, 80);
  const category = params.category ?? "";
  const mode = params.mode ?? "";
  const type = params.type ?? "";
  const sort = params.sort === "featured" ? "featured" : "recent";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const board = await listPublicJobs({
    q,
    location,
    category,
    mode,
    type,
    sort,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE
  });
  const pages = Math.max(1, Math.ceil(board.total / PAGE_SIZE));
  const hasFilters = Boolean(q || location || category || mode || type);

  /** The current search as a URL, with one value changed. Every view is shareable. */
  const hrefWith = (change: Partial<Record<FacetKey | "sort" | "page", string>>) => {
    const next: Record<string, string> = { q, location, category, mode, type, sort: sort === "recent" ? "" : sort, page: "", ...change };
    const search = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    const qs = search.toString();
    return (qs ? `/jobs?${qs}` : "/jobs") as Route;
  };
  const facetHref = (key: FacetKey, value: string) => {
    const current = key === "category" ? category : key === "mode" ? mode : type;
    return hrefWith({ [key]: current === value ? "" : value });
  };

  const subtitle = q || location
    ? `${arabic ? "نتائج البحث عن" : "Results for"} ${[q, location].filter(Boolean).join(" · ")}`
    : arabic
      ? "وظائف منشورة الآن من أصحاب عمل في الخليج وسوريا"
      : "Roles open right now with employers across the Gulf and Syria";

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <Eyebrow>{arabic ? "فرصتك القادمة" : "Your next opportunity"}</Eyebrow>
          <h1 className="m-0 mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">
            <Stopped>{arabic ? "اعثر على عمل يناسب طموحك." : "Find work that fits your ambition."}</Stopped>
          </h1>
          <p className="m-0 mt-4 max-w-2xl text-[17px] leading-relaxed text-ts-muted">
            {arabic ? "ابحث في الوظائف المنشورة في الخليج وسوريا، وقدّم بملف واحد." : "Search roles open across the Gulf and Syria, and apply with one profile."}
          </p>
          <JobSearchForm locale={locale} q={q} location={location} className="mt-8" />
        </Container>
      </section>

      {/* Facets: plain links, so every filtered view has its own shareable URL.
          They describe the search, not the facet selection, so choosing one
          does not hide the others. Sticky only from 900px up. */}
      {board.facets.categories.length || board.facets.workModes.length || board.facets.employmentTypes.length ? (
        <section className="z-20 border-b border-ts-line bg-ts-paper/95 py-4 backdrop-blur min-[900px]:sticky min-[900px]:top-20">
          <Container className="flex flex-col gap-3 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:gap-x-6">
            <FacetRow label={arabic ? "المجال" : "Function"} facets={board.facets.categories} active={category} name={(v) => categoryLabel(v, locale)} href={(v) => facetHref("category", v)} />
            <FacetRow label={arabic ? "نمط العمل" : "Work mode"} facets={board.facets.workModes} active={mode} name={(v) => workModeLabel(v, locale)} href={(v) => facetHref("mode", v)} />
            <FacetRow label={arabic ? "نوع العقد" : "Contract"} facets={board.facets.employmentTypes} active={type} name={(v) => employmentTypeLabel(v, locale)} href={(v) => facetHref("type", v)} />
            {hasFilters ? (
              <Link href="/jobs" className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-ts-chip px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink">
                <X size={14} aria-hidden="true" /> {arabic ? "مسح الكل" : "Clear all"}
              </Link>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="py-14 max-[680px]:py-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{rolesCount(board.total, locale)}</h2>
              <p className="m-0 mt-1.5 text-[15px] text-ts-muted">{subtitle}</p>
            </div>
            {board.total > 1 ? (
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ts-muted">{arabic ? "ترتيب" : "Sort"}</span>
                {[
                  { value: "recent", label: arabic ? "الأحدث" : "Newest" },
                  { value: "featured", label: arabic ? "المميزة أولاً" : "Featured first" }
                ].map((option) => (
                  <Link
                    key={option.value}
                    href={hrefWith({ sort: option.value === "recent" ? "" : option.value })}
                    aria-current={sort === option.value ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-ts-chip px-4 text-[13px] font-semibold transition-colors",
                      sort === option.value ? "bg-ts-primary-tint text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
                    )}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {board.items.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
                {board.items.map((job) => (
                  <PublicJobCard key={job.id} job={job} locale={locale} />
                ))}
              </div>
              {pages > 1 ? (
                <nav aria-label={arabic ? "الصفحات" : "Pages"} className="mt-10 flex items-center justify-center gap-3 text-sm font-bold">
                  {page > 1 ? (
                    <Link href={hrefWith({ page: page - 1 > 1 ? String(page - 1) : "" })} className="inline-flex h-10 items-center gap-1.5 rounded-ts-chip border border-ts-line bg-ts-surface px-4 text-ts-ink hover:border-ts-primary">
                      <ArrowLeft size={15} aria-hidden="true" className="rtl:-scale-x-100" /> {arabic ? "السابق" : "Previous"}
                    </Link>
                  ) : null}
                  <span className="text-ts-muted">{arabic ? `الصفحة ${page} من ${pages}` : `Page ${page} of ${pages}`}</span>
                  {page < pages ? (
                    <Link href={hrefWith({ page: String(page + 1) })} className="inline-flex h-10 items-center gap-1.5 rounded-ts-chip border border-ts-line bg-ts-surface px-4 text-ts-ink hover:border-ts-primary">
                      {arabic ? "التالي" : "Next"} <ArrowRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-ts-lg border border-dashed border-ts-line px-6 py-16 text-center">
              <span aria-hidden="true" className="grid size-14 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
                <Search size={24} />
              </span>
              <h3 className="m-0 text-xl font-bold text-ts-ink">
                {hasFilters ? (arabic ? "لا توجد نتائج" : "No roles found") : arabic ? "أولى الوظائف قادمة قريباً" : "First roles are on their way"}
              </h3>
              <p className="m-0 max-w-md text-[15px] text-ts-muted">
                {hasFilters
                  ? arabic
                    ? "جرّب مسمى وظيفياً أو موقعاً أوسع، أو امسح عوامل التصفية."
                    : "Try a broader title, company, or location — or clear the filters."
                  : arabic
                    ? "ينضم أصحاب العمل الآن. أنشئ ملفك لتكون جاهزاً عند نشر الوظائف."
                    : "Employers are joining now. Create your profile so you are ready when roles go live."}
              </p>
              <Link
                href={hasFilters ? "/jobs" : "/auth/login?mode=signup"}
                className="inline-flex h-11 items-center rounded-ts-md border border-ts-line bg-ts-surface px-5 text-sm font-semibold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
              >
                {hasFilters ? (arabic ? "مسح عوامل التصفية" : "Clear filters") : arabic ? "أنشئ ملفك" : "Create your profile"}
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

/**
 * One facet as a labelled row of chips with counts. Below 900px the chips
 * scroll sideways in their own strip instead of wrapping.
 */
function FacetRow({
  label,
  facets,
  active,
  name,
  href
}: {
  label: string;
  facets: Facet[];
  active: string;
  name: (value: string) => string;
  href: (value: string) => Route;
}) {
  if (!facets.length) return null;
  return (
    <div className="flex min-w-0 items-center gap-2 min-[900px]:flex-wrap">
      <span className="shrink-0 text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{label}</span>
      <div className="-mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:flex-none min-[900px]:flex-wrap min-[900px]:overflow-visible min-[900px]:px-0">
        {facets.map((facet) => (
          <Link
            key={facet.value}
            href={href(facet.value)}
            aria-pressed={active === facet.value}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ts-chip border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
              active === facet.value
                ? "border-ts-primary bg-ts-primary text-ts-on-primary"
                : "border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
            )}
          >
            {name(facet.value)}
            <span className={active === facet.value ? "text-white/75" : "text-ts-subtle"}>{facet.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

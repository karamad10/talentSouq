import type { Metadata } from "next";
import { ArrowUpRight, Building2, MapPin, Search, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { CompanyAvatar } from "@/components/public/job-card";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { listPublicCompanies, type PublicCompany } from "@/data/public-companies";
import { getSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { categoryLabel, rolesCount } from "@/lib/labels";
import { getPreferences } from "@/lib/locale";
import { Eyebrow, Stopped } from "@/components/brand-stop";

export const metadata: Metadata = {
  title: "Companies",
  description: "Meet the teams hiring across the Gulf and Syria through TalentSouq."
};

type CompaniesSearchParams = { q?: string; industry?: string };

/** A company's public page: its career page when published, otherwise its open roles. */
function companyHref(company: PublicCompany): Route {
  return (company.careerSlug ? `/careers/${company.careerSlug}` : `/jobs?q=${encodeURIComponent(company.name)}`) as Route;
}

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<CompaniesSearchParams> }) {
  const [params, { locale, theme }, user, all] = await Promise.all([searchParams, getPreferences(), getSessionUser(), listPublicCompanies()]);
  const arabic = locale === "ar";

  const q = (params.q ?? "").trim().slice(0, 80);
  const industry = params.industry ?? "";
  const keyword = q.toLowerCase();

  const results = all
    .filter((c) => !keyword || [c.name, c.industry, c.hqLocation].filter(Boolean).join(" ").toLowerCase().includes(keyword))
    .filter((c) => !industry || c.industry === industry);
  const industries = [...new Set(all.map((c) => c.industry).filter((v): v is string => Boolean(v)))];
  const hasFilters = Boolean(q || industry);

  const facetHref = (value: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (industry !== value) search.set("industry", value);
    const qs = search.toString();
    return (qs ? `/companies?${qs}` : "/companies") as Route;
  };

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <Eyebrow>{arabic ? "ملفات الشركات" : "Company profiles"}</Eyebrow>
          <h1 className="m-0 mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">
            <Stopped>{arabic ? "تعرّف على الفرق التي توظّف في الخليج وسوريا." : "Meet the teams hiring across the Gulf and Syria."}</Stopped>
          </h1>
          <p className="m-0 mt-4 max-w-2xl text-[17px] leading-relaxed text-ts-muted">
            {arabic ? "تعرّف على طريقة عمل الفريق قبل أن تتقدّم." : "See how a team works before you apply."}
          </p>

          {all.length > 0 ? (
            <form
              action="/companies"
              role="search"
              className="mt-8 flex flex-col items-stretch gap-3 rounded-ts-lg border border-ts-line bg-ts-surface-2/50 p-3 min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center"
            >
              <label className="flex h-14 w-full min-w-0 items-center gap-3 rounded-ts-md border-[1.5px] border-ts-field bg-ts-surface-2 px-4 transition-colors focus-within:border-ts-focus focus-within:bg-ts-surface min-[700px]:w-auto min-[700px]:flex-1">
                <Search size={19} aria-hidden="true" className="shrink-0 text-ts-muted" />
                <span className="sr-only">{arabic ? "ابحث عن شركة" : "Search companies"}</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder={arabic ? "اسم الشركة أو القطاع أو المدينة" : "Company name, industry, or city"}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ts-ink outline-none placeholder:text-ts-muted"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-14 w-full shrink-0 items-center justify-center rounded-ts-md bg-ts-primary px-7 text-[15px] font-bold text-ts-on-primary transition-transform hover:-translate-y-0.5 min-[700px]:w-auto"
              >
                {arabic ? "بحث" : "Search"}
              </button>
            </form>
          ) : null}
        </Container>
      </section>

      {industries.length > 1 ? (
        <section className="z-20 border-b border-ts-line bg-ts-paper/95 py-4 backdrop-blur min-[900px]:sticky min-[900px]:top-20">
          <Container className="flex flex-col gap-3 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:gap-x-6">
            <div className="flex min-w-0 items-center gap-2 min-[900px]:flex-wrap">
              <span className="shrink-0 text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{arabic ? "القطاع" : "Industry"}</span>
              <div className="-mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:flex-none min-[900px]:flex-wrap min-[900px]:overflow-visible min-[900px]:px-0">
                {industries.map((value) => (
                  <Link
                    key={value}
                    href={facetHref(value)}
                    aria-pressed={industry === value}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center rounded-ts-chip border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
                      industry === value
                        ? "border-ts-primary bg-ts-primary text-ts-on-primary"
                        : "border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
                    )}
                  >
                    {categoryLabel(value, locale)}
                  </Link>
                ))}
              </div>
            </div>
            {hasFilters ? (
              <Link href="/companies" className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-ts-chip px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink">
                <X size={14} aria-hidden="true" /> {arabic ? "مسح الكل" : "Clear all"}
              </Link>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="py-14 max-[680px]:py-10">
        <Container>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {results.map((company) => (
                <CompanyCard key={company.name} company={company} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-ts-lg border border-dashed border-ts-line px-6 py-16 text-center">
              <span aria-hidden="true" className="grid size-14 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
                <Building2 size={24} />
              </span>
              <h2 className="m-0 text-xl font-bold text-ts-ink">
                {hasFilters ? (arabic ? "لا توجد شركات مطابقة" : "No companies found") : arabic ? "أولى الشركات قادمة قريباً" : "The first companies are on their way"}
              </h2>
              <p className="m-0 max-w-md text-[15px] text-ts-muted">
                {hasFilters
                  ? arabic
                    ? "جرّب اسماً أو قطاعاً آخر، أو امسح عوامل التصفية."
                    : "Try another name or industry, or clear the filters."
                  : arabic
                    ? "ينضم أصحاب العمل الآن. هل توظّف؟ أنشئ حساب شركة وانشر أول وظيفة."
                    : "Employers are joining now. Hiring? Create a company account and post your first role."}
              </p>
              <Link
                href={hasFilters ? "/companies" : "/auth/login?mode=signup"}
                className="inline-flex h-11 items-center rounded-ts-md border border-ts-line bg-ts-surface px-5 text-sm font-semibold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
              >
                {hasFilters ? (arabic ? "مسح عوامل التصفية" : "Clear filters") : arabic ? "ابدأ التوظيف" : "Start hiring"}
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

function CompanyCard({ company, locale }: { company: PublicCompany; locale: Locale }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col gap-5 rounded-ts-lg border border-ts-line bg-ts-surface p-6 transition-all hover:-translate-y-1 hover:border-ts-primary hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <CompanyAvatar name={company.name} logoUrl={company.logoUrl} />
        <span
          className={cn(
            "inline-flex h-8 items-center rounded-ts-xs px-3 text-[13px] font-semibold",
            company.openRoles > 0 ? "bg-ts-primary-tint text-ts-primary-deep" : "bg-ts-surface-2 text-ts-muted"
          )}
        >
          {rolesCount(company.openRoles, locale)}
        </span>
      </div>
      <div className="min-w-0">
        {company.industry ? (
          <p className="m-0 flex items-center gap-1.5 text-[13px] font-bold text-ts-primary">
            <Building2 size={14} aria-hidden="true" /> {categoryLabel(company.industry, locale)}
          </p>
        ) : null}
        <h3 className="m-0 mt-2 text-xl font-bold tracking-[-0.02em] text-ts-ink">
          <Link href={companyHref(company)} className="after:absolute after:inset-0 group-hover:text-ts-primary-deep">
            {company.name}
          </Link>
        </h3>
        {company.hqLocation ? (
          <p className="m-0 mt-1.5 flex items-center gap-1.5 text-sm text-ts-muted">
            <MapPin size={14} aria-hidden="true" /> {company.hqLocation}
          </p>
        ) : null}
      </div>
      {company.summary ? <p className="[unicode-bidi:plaintext] m-0 line-clamp-3 text-sm leading-relaxed text-ts-muted">{company.summary}</p> : null}
      <span aria-hidden="true" className="mt-auto ms-auto text-ts-subtle transition-colors group-hover:text-ts-primary">
        <ArrowUpRight size={18} className="rtl:-scale-x-100" />
      </span>
    </article>
  );
}

import type { Metadata } from "next";
import { ArrowUpRight, Building2, MapPin, Search, Users, X } from "lucide-react";
import type { Route } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { companiesByOpenRoles, getCompanyJobs } from "@/data/companies";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Companies", description: "Explore growing teams hiring through TalentSouq." };

type CompaniesSearchParams = { q?: string; industry?: string; country?: string };

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<CompaniesSearchParams> }) {
  const [params, cookieStore, user] = await Promise.all([searchParams, cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const arabic = locale === "ar";

  const q = (params.q ?? "").trim();
  const industry = params.industry ?? "";
  const country = params.country ?? "";
  const keyword = q.toLowerCase();

  const all = companiesByOpenRoles();
  const results = all
    .filter(({ company }) => !keyword || `${company.name} ${company.industry} ${company.location}`.toLowerCase().includes(keyword))
    .filter(({ company }) => !industry || company.industry === industry)
    .filter(({ company }) => !country || company.country === country);

  const industries = [...new Set(all.map(({ company }) => company.industry))];
  const countries = [...new Set(all.map(({ company }) => company.country))];
  const totalRoles = all.reduce((sum, entry) => sum + entry.openRoles, 0);
  const hasFilters = Boolean(q || industry || country);

  const facetHref = (key: "industry" | "country", value: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (industry && key !== "industry") search.set("industry", industry);
    if (country && key !== "country") search.set("country", country);
    const current = key === "industry" ? industry : country;
    if (current !== value) search.set(key, value);
    const qs = search.toString();
    return (qs ? `/companies?${qs}` : "/companies") as Route;
  };

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-primary uppercase">{arabic ? "ملفات الشركات" : "Company profiles"}</p>
          <h1 className="m-0 mt-3 max-w-3xl text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">
            {arabic ? "تعرّف على الفرق التي تبني في الخليج." : "Meet the teams building across the Gulf."}
          </h1>
          <p className="m-0 mt-4 max-w-2xl text-[17px] leading-relaxed text-ts-muted">
            {arabic
              ? `${all.length} شركة تضم ${totalRoles} وظيفة مفتوحة — تعرّف على ثقافتها قبل التقديم.`
              : `${all.length} companies with ${totalRoles} open roles between them. See how a team works before you apply.`}
          </p>

          <form action="/companies" role="search" className="mt-8 flex flex-wrap items-center gap-3 rounded-ts-lg border border-ts-line bg-ts-surface-2/50 p-3">
            <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary">
              <Search size={19} aria-hidden="true" className="shrink-0 text-ts-muted" />
              <span className="sr-only">{arabic ? "ابحث عن شركة" : "Search companies"}</span>
              <input
                name="q"
                defaultValue={q}
                placeholder={arabic ? "اسم الشركة أو القطاع" : "Company name, industry, or city"}
                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ts-ink outline-none placeholder:text-ts-muted"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-14 shrink-0 items-center rounded-ts-md bg-ts-primary px-7 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {arabic ? "بحث" : "Search"}
            </button>
          </form>
        </Container>
      </section>

      <section className="sticky top-0 z-20 border-b border-ts-line bg-ts-paper/95 py-4 backdrop-blur">
        <Container className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{arabic ? "القطاع" : "Industry"}</span>
            {industries.map((value) => (
              <Link
                key={value}
                href={facetHref("industry", value)}
                aria-pressed={industry === value}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                  industry === value ? "border-ts-primary bg-ts-primary text-white" : "border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
                )}
              >
                {value}
              </Link>
            ))}
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{arabic ? "الدولة" : "Country"}</span>
            {countries.map((value) => (
              <Link
                key={value}
                href={facetHref("country", value)}
                aria-pressed={country === value}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                  country === value ? "border-ts-primary bg-ts-primary text-white" : "border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
                )}
              >
                {value}
              </Link>
            ))}
          </div>
          {hasFilters ? (
            <Link href="/companies" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink">
              <X size={14} aria-hidden="true" /> {arabic ? "مسح الكل" : "Clear all"}
            </Link>
          ) : null}
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container>
          <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">
            {results.length} {arabic ? "شركة" : results.length === 1 ? "company" : "companies"}
          </h2>

          {results.length > 0 ? (
            <div className="mt-8 grid gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {results.map(({ company, openRoles }) => {
                const roles = getCompanyJobs(company.name);
                return (
                  <article
                    key={company.slug}
                    className="group relative flex h-full flex-col gap-5 rounded-ts-lg border border-ts-line bg-ts-surface p-6 transition-all hover:-translate-y-1 hover:border-ts-primary hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-ts-md text-lg font-bold text-ts-ink/80" style={{ backgroundColor: company.accent }}>
                        {company.initials}
                      </span>
                      <span
                        className={cn(
                          "inline-flex h-8 items-center rounded-full px-3 text-[13px] font-bold",
                          openRoles > 0 ? "bg-ts-primary-tint text-ts-primary-deep" : "bg-ts-surface-2 text-ts-muted"
                        )}
                      >
                        {openRoles} {arabic ? "وظيفة" : openRoles === 1 ? "role" : "roles"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 flex items-center gap-1.5 text-[13px] font-bold text-ts-primary">
                        <Building2 size={14} aria-hidden="true" /> {company.industry}
                      </p>
                      <h3 className="m-0 mt-2 text-xl font-bold tracking-[-0.02em] text-ts-ink">
                        <Link href={`/companies/${company.slug}` as Route} className="after:absolute after:inset-0 group-hover:text-ts-primary-deep">
                          {company.name}
                        </Link>
                      </h3>
                      <p className="m-0 mt-2.5 text-sm leading-relaxed text-ts-muted">{company.summary}</p>
                    </div>

                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {company.values.slice(0, 2).map((value) => (
                        <li key={value} className="inline-flex h-8 items-center rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-muted">
                          {value}
                        </li>
                      ))}
                    </ul>

                    {roles.length > 0 ? (
                      <p className="m-0 truncate text-[13px] text-ts-muted">
                        {arabic ? "يوظفون: " : "Hiring: "}
                        <span className="font-semibold text-ts-ink">{roles.slice(0, 2).map((role) => role.title).join(", ")}</span>
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-ts-line pt-4 text-[13px] text-ts-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden="true" /> {company.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={14} aria-hidden="true" /> {company.size}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ms-auto grid size-10 place-items-center rounded-full border border-ts-line text-ts-muted transition-colors group-hover:border-ts-primary group-hover:bg-ts-primary-tint group-hover:text-ts-primary-deep"
                      >
                        <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-ts-lg border border-dashed border-ts-line px-6 py-16 text-center">
              <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-ts-surface-2 text-ts-muted">
                <Building2 size={24} />
              </span>
              <h3 className="m-0 text-xl font-bold text-ts-ink">{arabic ? "لا توجد شركات مطابقة" : "No companies match this search"}</h3>
              <p className="m-0 max-w-md text-[15px] text-ts-muted">
                {arabic ? "جرّب قطاعاً أو دولة أخرى." : "Try another industry or country, or clear the filters."}
              </p>
              <Link
                href="/companies"
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

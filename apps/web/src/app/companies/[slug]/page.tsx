import type { Metadata } from "next";
import { ArrowLeft, Building2, CalendarDays, Check, MapPin, Users } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { PublicJobCard } from "@/components/public/job-card";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { companies, getCompany, getCompanyJobs } from "@/data/companies";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const company = getCompany((await params).slug);
  return company ? { title: company.name, description: `${company.name} careers on TalentSouq.` } : {};
}

export default async function CompanyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolved, cookieStore, user] = await Promise.all([params, cookies(), getSessionUser()]);
  const company = getCompany(resolved.slug);
  if (!company) notFound();
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const arabic = locale === "ar";
  const companyJobs = getCompanyJobs(company.name);

  const facts = [
    { icon: Building2, label: arabic ? "القطاع" : "Industry", value: company.industry },
    { icon: MapPin, label: arabic ? "المقر" : "Headquarters", value: company.location },
    { icon: Users, label: arabic ? "حجم الفريق" : "Team size", value: company.size },
    { icon: CalendarDays, label: arabic ? "التأسيس" : "Founded", value: company.founded }
  ];

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-bold text-ts-muted transition-colors hover:text-ts-ink"
          >
            <ArrowLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" /> {arabic ? "العودة إلى الشركات" : "Back to companies"}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-ts-lg text-2xl font-bold text-ts-ink/80" style={{ backgroundColor: company.accent }}>
              {company.initials}
            </span>
            <div className="min-w-70 flex-1">
              <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-primary uppercase">{company.industry}</p>
              <h1 className="m-0 mt-2 text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">{company.name}</h1>
              <p className="m-0 mt-3 max-w-2xl text-[17px] leading-relaxed text-ts-muted">{company.summary}</p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-ts-primary-tint px-5 text-sm font-bold text-ts-primary-deep">
              {companyJobs.length} {arabic ? "وظيفة مفتوحة" : companyJobs.length === 1 ? "open role" : "open roles"}
            </span>
          </div>
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container className="grid items-start gap-10 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <div className="flex min-w-0 flex-col gap-10">
            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "ما الذي يهمهم" : "What they value"}</h2>
              <ul className="m-0 mt-5 grid list-none gap-3 p-0 min-[560px]:grid-cols-3">
                {company.values.map((value) => (
                  <li key={value} className="flex items-start gap-3 rounded-ts-lg border border-ts-line bg-ts-surface p-5">
                    <span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ts-primary text-white">
                      <Check size={14} />
                    </span>
                    <span className="text-[15px] font-semibold text-ts-ink">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "الوظائف المفتوحة" : "Open roles"}</h2>
                <Link href="/jobs" className="text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
                  {arabic ? "كل الوظائف" : "See all jobs"}
                </Link>
              </div>
              {companyJobs.length > 0 ? (
                <div className="mt-6 grid gap-6 min-[760px]:grid-cols-2">
                  {companyJobs.map((job) => (
                    <PublicJobCard key={job.id} job={job} locale={locale} />
                  ))}
                </div>
              ) : (
                <p className="m-0 mt-6 rounded-ts-lg border border-dashed border-ts-line px-6 py-12 text-center text-[15px] text-ts-muted">
                  {arabic ? "لا توجد وظائف مفتوحة حالياً." : "No open roles right now — check back soon."}
                </p>
              )}
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-6">
            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-base font-bold text-ts-ink">{arabic ? "نبذة سريعة" : "At a glance"}</h2>
              <ul className="m-0 mt-4 flex list-none flex-col p-0">
                {facts.map((fact, index) => {
                  const Icon = fact.icon;
                  return (
                    <li key={fact.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                      <div className="flex items-center gap-3 py-3.5">
                        <Icon size={17} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                        <span className="w-28 shrink-0 text-[13px] font-semibold text-ts-muted">{fact.label}</span>
                        <strong className="min-w-0 flex-1 text-sm font-bold text-ts-ink">{fact.value}</strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-base font-bold text-ts-ink">{arabic ? "المزايا" : "Benefits"}</h2>
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {company.perks.map((perk) => (
                  <li key={perk} className="inline-flex h-9 items-center rounded-full bg-ts-surface-2 px-3.5 text-[13px] font-semibold text-ts-muted">
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <CtaBand locale={locale} />
      <PublicFooter locale={locale} />
    </main>
  );
}

import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Check, Clock3, GraduationCap, MapPin, Users, Wallet, Zap } from "lucide-react";
import type { Route } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { salaryLabel } from "@/components/dashboard/job-list";
import { PublicJobCard } from "@/components/public/job-card";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { getCompany } from "@/data/companies";
import { getJob, jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const job = getJob((await params).id);
  return job ? { title: job.title, description: `${job.title} at ${job.company} in ${job.location}.` } : {};
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolved, cookieStore, user] = await Promise.all([params, cookies(), getSessionUser()]);
  const job = getJob(resolved.id);
  if (!job) notFound();
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const arabic = locale === "ar";

  const company = getCompany(job.company.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const similar = jobs.filter((item) => item.id !== job.id && item.category === job.category).slice(0, 2);

  const facts = [
    { icon: Wallet, label: arabic ? "الراتب الشهري" : "Monthly salary", value: salaryLabel(job) },
    { icon: BriefcaseBusiness, label: arabic ? "نوع العقد" : "Contract", value: `${job.type} · ${job.seniority}` },
    { icon: MapPin, label: arabic ? "الموقع" : "Location", value: `${job.location} · ${job.mode}` },
    { icon: GraduationCap, label: arabic ? "التعليم" : "Education", value: job.education },
    { icon: Users, label: arabic ? "المتقدمون" : "Applicants", value: `${job.applicants}` },
    { icon: Clock3, label: arabic ? "نُشرت" : "Posted", value: job.posted }
  ];

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-ts-muted transition-colors hover:text-ts-ink">
            <ArrowLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" /> {arabic ? "العودة إلى الوظائف" : "Back to jobs"}
          </Link>

          <div className="mt-8 flex flex-wrap items-start gap-6">
            <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-ts-lg text-2xl font-bold text-ts-ink/80" style={{ backgroundColor: job.accent }}>
              {job.initials}
            </span>
            <div className="min-w-70 flex-1">
              <Link href={company ? (`/companies/${company.slug}` as Route) : "/companies"} className="text-[13px] font-bold text-ts-primary hover:text-ts-primary-deep">
                {job.company}
              </Link>
              <h1 className="m-0 mt-2 text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">{job.title}</h1>
              <p className="m-0 mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-ts-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} aria-hidden="true" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness size={16} aria-hidden="true" /> {job.type} · {job.mode}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={16} aria-hidden="true" /> {arabic ? "نُشرت" : "Posted"} {job.posted}
                </span>
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 items-center rounded-full bg-ts-primary-tint px-4 text-[13px] font-bold text-ts-primary-deep">{salaryLabel(job)}</span>
                {job.easyApply ? (
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ts-accent-tint px-4 text-[13px] font-bold text-ts-accent-deep">
                    <Zap size={14} aria-hidden="true" /> {arabic ? "تقديم سريع" : "Easy apply"}
                  </span>
                ) : null}
                {job.visaSponsorship ? (
                  <span className="inline-flex h-9 items-center rounded-full bg-ts-success-tint px-4 text-[13px] font-bold text-ts-success">
                    {arabic ? "كفالة إقامة" : "Visa sponsorship"}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container className="grid items-start gap-10 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <article className="flex min-w-0 flex-col gap-10">
            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "عن الوظيفة" : "About the role"}</h2>
              <p className="m-0 mt-4 text-[17px] leading-relaxed text-ts-muted">
                {job.summary}{" "}
                {arabic
                  ? "ستعمل مع فريق متعدد التخصصات، وتحوّل الأفكار إلى نتائج عملية، وترفع مستوى الجودة مع نمو الشركة."
                  : "You will work with a thoughtful cross-functional team, turn insight into practical outcomes, and help raise the quality bar as the company grows."}
              </p>
            </div>

            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "ما نبحث عنه" : "What you’ll bring"}</h2>
              <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                {[
                  arabic ? "إتقان واضح في تخصصك وتواصل فعّال." : "Strong craft and clear communication in your discipline.",
                  arabic ? "خبرة في العمل عبر الفرق والتعامل مع الغموض." : "Experience collaborating across functions and navigating ambiguity.",
                  arabic ? "نهج عملي وفضولي يهتم بالعملاء والزملاء." : "A practical, curious approach with care for customers and colleagues."
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ts-ink">
                    <span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ts-primary text-white">
                      <Check size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "المهارات المطلوبة" : "Skills for this role"}</h2>
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {job.skills.map((skill) => (
                  <li key={skill} className="inline-flex h-10 items-center rounded-full border border-ts-line bg-ts-surface px-4 text-sm font-semibold text-ts-ink">
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="m-0 mt-4 text-[15px] text-ts-muted">
                {arabic ? "لغات العمل: " : "Working languages: "}
                <span className="font-semibold text-ts-ink">{job.languages.join(", ")}</span>
              </p>
            </div>

            {similar.length > 0 ? (
              <div>
                <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "وظائف مشابهة" : "Similar roles"}</h2>
                <div className="mt-6 grid gap-6 min-[760px]:grid-cols-2">
                  {similar.map((item) => (
                    <PublicJobCard key={item.id} job={item} locale={locale} />
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <aside className="flex min-w-0 flex-col gap-6 min-[1000px]:sticky min-[1000px]:top-8">
            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <span className="inline-flex h-8 items-center rounded-full bg-ts-success-tint px-3 text-[13px] font-bold text-ts-success">
                {arabic ? "يوظفون الآن" : "Actively hiring"}
              </span>
              <h2 className="m-0 mt-4 text-xl font-bold tracking-[-0.02em] text-ts-ink">{arabic ? "مهتم بهذه الوظيفة؟" : "Interested in this role?"}</h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-ts-muted">
                {arabic ? "أنشئ ملفك مرة واحدة وقدّم بثقة." : "Create your TalentSouq profile once and apply with confidence."}
              </p>
              <Link
                href="/auth/login?mode=signup"
                className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-ts-md bg-ts-primary px-6 text-base font-bold text-white transition-opacity hover:opacity-90"
              >
                {arabic ? "قدّم الآن" : "Apply now"}
              </Link>
              <Link
                href="/jobs"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface px-6 text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
              >
                {arabic ? "تصفح وظائف أخرى" : "Browse more roles"}
              </Link>
            </div>

            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-base font-bold text-ts-ink">{arabic ? "تفاصيل الوظيفة" : "Role details"}</h2>
              <ul className="m-0 mt-4 flex list-none flex-col p-0">
                {facts.map((fact, index) => {
                  const Icon = fact.icon;
                  return (
                    <li key={fact.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                      <div className="flex items-center gap-3 py-3.5">
                        <Icon size={17} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                        <span className="w-32 shrink-0 text-[13px] font-semibold text-ts-muted">{fact.label}</span>
                        <strong className="min-w-0 flex-1 text-sm font-bold text-ts-ink">{fact.value}</strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {company ? (
              <Link
                href={`/companies/${company.slug}` as Route}
                className="group flex items-center gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-6 transition-colors hover:border-ts-primary"
              >
                <span aria-hidden="true" className="grid size-13 shrink-0 place-items-center rounded-ts-md text-base font-bold text-ts-ink/80" style={{ backgroundColor: company.accent }}>
                  {company.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{company.name}</span>
                  <span className="block text-[13px] text-ts-muted">{company.industry}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-ts-muted rtl:-scale-x-100" />
              </Link>
            ) : null}
          </aside>
        </Container>
      </section>

      <CtaBand locale={locale} />
      <PublicFooter locale={locale} />
    </main>
  );
}

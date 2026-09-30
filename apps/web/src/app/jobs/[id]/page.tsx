import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CalendarClock, Clock3, GraduationCap, MapPin, Wallet, Zap } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { CompanyAvatar, PublicJobCard, companyName, jobTitle } from "@/components/public/job-card";
import { Container, CtaBand, PublicFooter } from "@/components/public/public-shell";
import { getPublicJob, listPublicJobs, type PublicJobDetail } from "@/data/public-jobs";
import { authRedirectPath } from "@/lib/auth/redirects";
import { getSessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";
import { categoryLabel, employmentTypeLabel, experienceLabel, formatDate, postedLabel, salaryLabel, workModeLabel } from "@/lib/labels";
import { getLocale, getPreferences } from "@/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const [{ id }, locale] = await Promise.all([params, getLocale()]);
  const job = await getPublicJob(id);
  if (!job) return {};
  const title = jobTitle(job, locale);
  const name = companyName(job, locale);
  const where = job.location ? (locale === "ar" ? ` في ${job.location}` : ` in ${job.location}`) : "";
  const description = locale === "ar" ? `${title} لدى ${name}${where}.` : `${title} at ${name}${where}.`;
  return { title, description, openGraph: { title: `${title} · ${name}`, description, url: `/jobs/${job.id}` } };
}

type ApplyTarget = { href: string; kind: "external" | "signup" | "app" };

/**
 * Where "Apply" goes: the employer's own site; for applying inside TalentSouq,
 * registration first when signed out (and back to this job afterwards), or the
 * app once the visitor has an account.
 */
function applyTarget(job: PublicJobDetail, signedIn: boolean): ApplyTarget {
  if (job.applyUrl) return { href: job.applyUrl, kind: "external" };
  if (!signedIn) return { href: authRedirectPath({ mode: "signup", next: `/jobs/${job.id}` }), kind: "signup" };
  return { href: "/download", kind: "app" };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale, theme }, user] = await Promise.all([params, getPreferences(), getSessionUser()]);
  const job = await getPublicJob(id);
  if (!job) notFound();
  const arabic = locale === "ar";

  const title = jobTitle(job, locale);
  const name = companyName(job, locale);
  // The employer's own words, in Arabic when they wrote them and the visitor reads Arabic.
  const description = arabic && job.descriptionAr ? job.descriptionAr : job.description;
  const similar = job.category
    ? (await listPublicJobs({ category: job.category, limit: 4 })).items.filter((item) => item.id !== job.id).slice(0, 3)
    : [];
  const apply = applyTarget(job, Boolean(user));
  const companyHref = (job.company.careerSlug ? `/careers/${job.company.careerSlug}` : `/jobs?q=${encodeURIComponent(job.company.name)}`) as Route;

  const facts = [
    { icon: Wallet, label: arabic ? "الراتب" : "Salary", value: salaryLabel(job.salaryMin, job.salaryMax, job.currency, locale) },
    { icon: BriefcaseBusiness, label: arabic ? "نوع العقد" : "Contract", value: employmentTypeLabel(job.employmentType, locale) },
    { icon: MapPin, label: arabic ? "الموقع" : "Location", value: [job.location, workModeLabel(job.workMode, locale)].filter(Boolean).join(" · ") },
    { icon: GraduationCap, label: arabic ? "الخبرة" : "Experience", value: experienceLabel(job.experienceMin, job.experienceMax, locale) },
    { icon: CalendarClock, label: arabic ? "آخر موعد للتقديم" : "Apply by", value: formatDate(job.deadline, locale) },
    { icon: Clock3, label: arabic ? "نُشرت" : "Posted", value: postedLabel(job.createdAt, locale) }
  ].filter((fact) => fact.value);

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface py-14 max-[680px]:py-10">
        <Container>
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-ts-muted transition-colors hover:text-ts-ink">
            <ArrowLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" /> {arabic ? "العودة إلى الوظائف" : "Back to jobs"}
          </Link>

          <div className="mt-8 flex flex-wrap items-start gap-6">
            <CompanyAvatar name={name} logoUrl={job.company.logoUrl} size="lg" />
            <div className="min-w-0 flex-1 min-[560px]:min-w-70">
              <Link href={companyHref} className="text-[13px] font-bold text-ts-primary hover:text-ts-primary-deep">
                {name}
              </Link>
              <h1 className="m-0 mt-2 text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">{title}</h1>
              <p className="m-0 mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-ts-muted">
                {job.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} aria-hidden="true" /> {job.location}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness size={16} aria-hidden="true" />
                  {[employmentTypeLabel(job.employmentType, locale), workModeLabel(job.workMode, locale)].filter(Boolean).join(" · ")}
                </span>
                {job.category ? <span>{categoryLabel(job.category, locale)}</span> : null}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 items-center rounded-full bg-ts-primary-tint px-4 text-[13px] font-bold text-ts-primary-deep">
                  {salaryLabel(job.salaryMin, job.salaryMax, job.currency, locale)}
                </span>
                {job.easyApply ? (
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ts-accent-tint px-4 text-[13px] font-bold text-ts-accent-deep">
                    <Zap size={14} aria-hidden="true" /> {arabic ? "تقديم سريع" : "Easy apply"}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <article className="flex min-w-0 flex-col gap-10">
            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "عن الوظيفة" : "About the role"}</h2>
              <p className="[unicode-bidi:plaintext] m-0 mt-4 text-[17px] leading-relaxed whitespace-pre-line text-ts-muted">
                {description}
              </p>
              {arabic && !job.descriptionAr && description ? (
                <p className="m-0 mt-3 text-[13px] text-ts-subtle">كتب صاحب العمل هذا الوصف بالإنجليزية.</p>
              ) : null}
            </div>

            {job.skills.length > 0 ? (
              <div>
                <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "المهارات المطلوبة" : "Skills for this role"}</h2>
                <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                  {job.skills.map((skill) => (
                    <li key={skill} className="[unicode-bidi:plaintext] inline-flex h-10 items-center rounded-full border border-ts-line bg-ts-surface px-4 text-sm font-semibold text-ts-ink">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {similar.length > 0 ? (
              <div>
                <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "وظائف مشابهة" : "Similar roles"}</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 min-[760px]:grid-cols-2">
                  {similar.map((item) => (
                    <PublicJobCard key={item.id} job={item} locale={locale} />
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <aside className="flex min-w-0 flex-col gap-6 min-[1000px]:sticky min-[1000px]:top-8">
            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">{arabic ? "مهتم بهذه الوظيفة؟" : "Interested in this role?"}</h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-ts-muted">
                {apply.kind === "external"
                  ? arabic
                    ? "يستقبل صاحب العمل الطلبات عبر موقعه."
                    : "This employer takes applications on their own site."
                  : apply.kind === "signup"
                    ? arabic
                      ? "أنشئ حساباً مجانياً للتقديم بملفك وسيرتك الذاتية، وتابع طلبك خطوة بخطوة."
                      : "Create a free account to apply with your profile and CV, and follow your application step by step."
                    : arabic
                      ? "قدّم من تطبيق تالنت سوق بملفك وسيرتك الذاتية، وتابع طلبك خطوة بخطوة."
                      : "Apply in the TalentSouq app with your profile and CV, and follow your application step by step."}
              </p>
              <ApplyButton target={apply} locale={locale} />
              {apply.kind === "signup" ? (
                <p className="m-0 mt-3 text-center text-[13px] text-ts-muted">
                  {arabic ? "لديك حساب؟ " : "Already have an account? "}
                  <Link href={authRedirectPath({ next: `/jobs/${job.id}` }) as Route} className="font-bold text-ts-primary-deep hover:underline">
                    {arabic ? "سجّل الدخول" : "Log in"}
                  </Link>
                </p>
              ) : null}
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
                        <span className="min-w-0 flex-1 text-[13px] font-semibold text-ts-muted min-[400px]:w-32 min-[400px]:flex-none min-[400px]:shrink-0">{fact.label}</span>
                        <strong className="min-w-0 flex-1 text-end text-sm font-bold text-ts-ink min-[400px]:text-start">{fact.value}</strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link href={companyHref} className="group flex items-center gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-6 transition-colors hover:border-ts-primary">
              <CompanyAvatar name={name} logoUrl={job.company.logoUrl} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{name}</span>
                {job.company.industry ? <span className="block text-[13px] text-ts-muted">{categoryLabel(job.company.industry, locale)}</span> : null}
              </span>
              <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-ts-muted rtl:-scale-x-100" />
            </Link>
          </aside>
        </Container>
      </section>

      <CtaBand locale={locale} />
      <PublicFooter locale={locale} />
    </main>
  );
}

function ApplyButton({ target, locale }: { target: ApplyTarget; locale: Locale }) {
  const { href, kind } = target;
  const arabic = locale === "ar";
  const className =
    "mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-ts-md bg-ts-primary px-6 text-base font-bold text-white transition-opacity hover:opacity-90";
  if (kind === "external") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className}>
        {arabic ? "قدّم على موقع الشركة" : "Apply on company site"} <ArrowUpRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
      </a>
    );
  }
  return (
    <Link href={href as Route} className={className}>
      {kind === "signup" ? (arabic ? "أنشئ حساباً للتقديم" : "Sign up to apply") : arabic ? "قدّم عبر التطبيق" : "Apply in the app"}
    </Link>
  );
}

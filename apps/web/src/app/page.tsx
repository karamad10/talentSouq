import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, FileText, MessagesSquare, Search, UsersRound } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { CompanyAvatar, PublicJobCard, companyName, jobTitle } from "@/components/public/job-card";
import type { PublicJob } from "@/data/public-jobs";
import type { Locale } from "@/lib/i18n";
import { JobSearchForm } from "@/components/public/job-search-form";
import { Container, CtaBand, PublicFooter, SectionHeading } from "@/components/public/public-shell";
import { StoreBadges } from "@/components/public/store-badges";
import { VerifiedBadge } from "@/components/public/verified-badge";
import { listPublicCompanies } from "@/data/public-companies";
import { listPublicJobs } from "@/data/public-jobs";
import { getSessionUser } from "@/lib/auth/session";
import { dictionary } from "@/lib/i18n";
import { categoryLabel, chipCategories, companiesCount, rolesCount, salaryLabel, showVolume } from "@/lib/labels";
import { getPreferences } from "@/lib/locale";
import { Eyebrow, Stopped } from "@/components/brand-stop";

/* The public home page runs on a quieter system than the workspace: hairline
   edges, one accent, semibold (never bold) headings, and fluid clamp() rhythm
   so the layout breathes rather than snapping between breakpoints. */
const buttonPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-ts-md bg-ts-primary px-6 text-[15px] font-semibold text-ts-on-primary transition-colors hover:bg-ts-primary-deep";
const buttonQuiet =
  "inline-flex h-12 items-center justify-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface px-6 text-[15px] font-semibold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep";
const sectionPad = "py-[clamp(3.5rem,8vw,6.5rem)]";

export default async function HomePage() {
  const [{ locale, theme }, user, board, companies] = await Promise.all([
    getPreferences(),
    getSessionUser(),
    listPublicJobs({ sort: "featured", limit: 3 }),
    listPublicCompanies()
  ]);
  const copy = dictionary[locale];
  const arabic = locale === "ar";

  // Everything below is the live board (report RPT-2026-014 §6: the site showed
  // demo jobs and made-up totals). Each section hides itself when it is empty.
  const featured = board.items;
  const hiring = companies.filter((company) => company.openRoles > 0).slice(0, 6);
  // Counts and function chips only once the board is big enough not to read as empty.
  const showCounts = showVolume(board.total);
  const categories = showCounts ? chipCategories(board.facets.categories) : [];
  const proof = showCounts
    ? [rolesCount(board.total, locale), companiesCount(companies.length, locale), copy.proof.response]
    : arabic
      ? ["أصحاب عمل موثّقون", "بالعربية والإنجليزية", copy.proof.response]
      : ["Verified employers", "Arabic and English", copy.proof.response];

  const steps = [
    { icon: FileText, title: arabic ? "أنشئ ملفك" : "Build one profile", body: arabic ? "ارفع سيرتك الذاتية مرة واحدة، واستخدمها في كل طلب تقديم." : "Upload your CV once and let it carry into every application." },
    { icon: Search, title: arabic ? "اكتشف الوظائف المناسبة" : "See roles that fit", body: arabic ? "نرتّب الوظائف حسب ملاءمتها لخبرتك وتفضيلاتك." : "Roles are ranked against your experience and preferences, not the noise." },
    { icon: MessagesSquare, title: arabic ? "تابع كل ردّ" : "Track every reply", body: arabic ? "تابع المقابلات والرسائل والعروض في مكان واحد." : "Interviews, messages, and offers stay in one place you can follow." }
  ];

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      {/* Hero: light ground, the photograph framed rather than flooded, and the
          search bar as the single loudest element on the page. */}
      <section className="ts-bg-light relative overflow-hidden">
        <Container className="relative grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(2.5rem,5vw,4rem)] min-[1000px]:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
            <h1 className="m-0 mt-5 text-[clamp(2.3rem,5.6vw,4.1rem)] leading-[1.05] font-bold tracking-[-0.04em] text-balance text-ts-ink">
              <Stopped>{copy.hero.titleStart}</Stopped>
              <br />
              <span className="text-ts-primary">
                <Stopped>{copy.hero.titleAccent}</Stopped>
              </span>
            </h1>
            <p className="m-0 mt-5 max-w-xl text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed text-pretty text-ts-muted">{copy.hero.body}</p>

            <JobSearchForm locale={locale} className="mt-8" />

            <div className="mt-5 flex flex-col items-stretch gap-3 min-[520px]:flex-row min-[520px]:flex-wrap min-[520px]:items-center">
              <Link href="/jobs" className={buttonPrimary}>
                {copy.hero.find}
                <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
              <Link href="/#employers" className={buttonQuiet}>
                {copy.hero.hire}
              </Link>
            </div>

            <StoreBadges locale={locale} className="mt-5" />

            {categories.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2.5">
                <span className="text-[13px] text-ts-subtle">{arabic ? "الأكثر طلباً" : "Popular"}</span>
                {categories.slice(0, 5).map((item) => (
                  <Link
                    key={item.value}
                    href={`/jobs?category=${encodeURIComponent(item.value)}` as Route}
                    className="text-[14px] font-medium text-ts-ink underline decoration-ts-line underline-offset-[6px] transition-colors hover:text-ts-primary hover:decoration-ts-primary"
                  >
                    {categoryLabel(item.value, locale)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Framed photograph, with the newest featured role floating on it.
              The card is a real listing or nothing: no invented job, company,
              badge or match score. */}
          <div className="relative w-full min-w-0 max-[1000px]:order-first">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-ts-xl border border-ts-line-soft bg-ts-surface-2 min-[1000px]:aspect-[7/8]">
              <Image
                className="object-cover"
                src="/images/talentsouq-hero.webp"
                alt={arabic ? "مهنيون يتعاونون في بيئة عمل حديثة" : "Professionals collaborating in a contemporary workplace"}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 46vw"
              />
            </div>
            {featured[0] ? <HeroJobCard job={featured[0]} locale={locale} /> : null}
          </div>
        </Container>

        {/* Proof, stated once and quietly. */}
        <Container>
          <div className="flex flex-wrap items-baseline gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-5 border-t border-ts-line-soft py-8">
            <Eyebrow className="w-full min-[900px]:w-auto">{copy.proof.label}</Eyebrow>
            {proof.map((claim) => (
              <div key={claim} className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ts-accent" />
                <strong className="text-[15px] font-semibold tracking-[-0.01em] text-ts-ink">{claim}</strong>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Who is hiring — a quiet row of real employers, hidden until there are any. */}
      {hiring.length > 0 ? (
        <section className="border-y border-ts-line-soft bg-ts-surface py-7">
          <Container className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:gap-x-9">
            <Eyebrow>{arabic ? "يوظّفون الآن" : "Hiring right now"}</Eyebrow>
            <div className="-mx-5 flex items-center gap-x-7 gap-y-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:flex-wrap min-[900px]:overflow-visible min-[900px]:px-0">
              {hiring.map((company, index) => (
                <Link
                  key={`${company.name}-${index}`}
                  href={(company.careerSlug ? `/careers/${company.careerSlug}` : `/jobs?q=${encodeURIComponent(company.name)}`) as Route}
                  className="group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap"
                >
                  <CompanyAvatar name={company.name} logoUrl={company.logoUrl} size="sm" />
                  <span className="text-sm font-medium text-ts-ink transition-colors group-hover:text-ts-primary">{company.name}</span>
                  {showCounts ? <span className="text-[13px] text-ts-subtle">{company.openRoles}</span> : null}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Featured roles */}
      <section className={sectionPad}>
        <Container>
          <SectionHeading
            eyebrow={copy.sections.jobsEyebrow}
            title={copy.sections.jobsTitle}
            body={copy.sections.jobsBody}
            action={{ href: "/jobs", label: copy.sections.viewAll }}
          />
          {featured.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-5 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {featured.map((job) => (
                <PublicJobCard key={job.id} job={job} locale={locale} />
              ))}
            </div>
          ) : (
            // Launch day, before the first listing: say so, and give people something to do.
            <div className="mt-10 flex flex-col items-start gap-3 rounded-ts-xl border border-dashed border-ts-line px-6 py-10 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
              <div className="min-w-0">
                <h3 className="m-0 text-xl font-semibold tracking-[-0.02em] text-ts-ink">{arabic ? "أولى الوظائف في الطريق" : "First roles are on their way"}</h3>
                <p className="m-0 mt-1.5 max-w-xl text-[15px] text-ts-muted">
                  {arabic
                    ? "أصحاب العمل في الخليج وسوريا ينضمّون الآن. أنشئ ملفك لتكون من أوائل المتقدّمين."
                    : "Employers across the Gulf and Syria are joining now. Create your profile to be first in line."}
                </p>
              </div>
              <Link href="/auth/login?mode=signup" className={buttonPrimary}>
                {copy.sections.start} <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Browse by function — a hairline list, only once there is something to browse. */}
      {categories.length > 0 ? (
        <section className={`border-y border-ts-line-soft bg-ts-surface ${sectionPad}`}>
          <Container>
            <SectionHeading
              eyebrow={arabic ? "تصفّح حسب المجال" : "Browse by function"}
              title={arabic ? "ابدأ من مجالك." : "Start where you already work."}
              body={arabic ? "في كل مجال، الوظائف المتاحة اليوم في الخليج وسوريا." : "Every function shows what is genuinely open across the Gulf and Syria today."}
            />
            <div className="mt-9 grid gap-x-10 border-t border-ts-line [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]">
              {categories.map((item) => (
                <Link
                  key={item.value}
                  href={`/jobs?category=${encodeURIComponent(item.value)}` as Route}
                  className="group flex items-center justify-between gap-4 border-b border-ts-line py-5 transition-colors hover:border-ts-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium text-ts-ink transition-colors group-hover:text-ts-primary">{categoryLabel(item.value, locale)}</span>
                    <span className="mt-0.5 block text-[13px] text-ts-subtle">{rolesCount(item.count, locale)}</span>
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" className="shrink-0 text-ts-subtle transition-colors group-hover:text-ts-primary rtl:-scale-x-100" />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* For talent */}
      <section className={sectionPad} id="talent">
        <Container className="grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4.5rem)] min-[1000px]:grid-cols-2">
          <div className="order-2 min-w-0 min-[1000px]:order-1">
            <span className="grid size-11 place-items-center rounded-ts-md border border-ts-line-soft bg-ts-primary-tint text-ts-on-primary-tint">
              <UsersRound size={20} aria-hidden="true" />
            </span>
            <Eyebrow className="mt-5">{arabic ? "للباحثين عن عمل" : "For talent"}</Eyebrow>
            <h2 className="m-0 mt-3 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ts-ink">{copy.sections.seekerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[16px] leading-relaxed text-pretty text-ts-muted">{copy.sections.seekerBody}</p>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {[
                arabic ? "ملف مهني متكامل" : "One complete professional profile",
                arabic ? "اقتراحات وظائف أذكى" : "Smarter role recommendations",
                arabic ? "متابعة واضحة لطلباتك" : "Clear application tracking"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-ts-ink">
                  <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-ts-on-primary-tint">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/login?mode=signup" className={`${buttonPrimary} mt-8 w-full min-[520px]:w-auto`}>
              {copy.sections.start} <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>

          {/* What the profile looks like, drawn as an empty frame: no invented
              person, company or match score (only a real profile produces those). */}
          <div aria-hidden="true" className="order-1 min-w-0 min-[1000px]:order-2">
            <div className="rounded-ts-xl border border-ts-line bg-ts-surface p-6 shadow-ts-card">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-on-primary-tint">
                  <UsersRound size={20} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="block h-3 w-2/5 rounded-ts-xs bg-ts-surface-2" />
                  <span className="block h-2.5 w-3/5 rounded-ts-xs bg-ts-surface-2" />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <span className="block h-2 w-full rounded-ts-xs bg-ts-surface-2" />
                <span className="block h-2 w-3/5 rounded-ts-xs bg-ts-surface-2" />
              </div>
              <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-ts-line-soft p-0 pt-5">
                {[
                  { icon: FileText, label: arabic ? "السيرة الذاتية" : "CV" },
                  { icon: BriefcaseBusiness, label: arabic ? "الخبرة" : "Experience" },
                  { icon: Search, label: arabic ? "الوظائف التي تريدها" : "Roles you want" }
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-[13px] text-ts-muted">
                    <Icon size={15} className="shrink-0 text-ts-primary" />
                    <span className="flex-1">{label}</span>
                    <span className="block h-2 w-16 rounded-ts-xs bg-ts-surface-2" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-ts-lg border border-ts-line bg-ts-surface px-4 py-3 shadow-ts-card">
              <span className="grid size-7 place-items-center rounded-ts-sm bg-ts-success-tint text-ts-success">
                <Check size={14} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-semibold text-ts-ink">{arabic ? "تم إرسال الطلب" : "Application sent"}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* For employers */}
      <section className={`border-y border-ts-line-soft bg-ts-surface ${sectionPad}`} id="employers">
        <Container className="grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4.5rem)] min-[1000px]:grid-cols-2">
          {/* The pipeline's stages, drawn as an empty frame: no invented candidates or scores. */}
          <div aria-hidden="true" className="min-w-0">
            <div className="rounded-ts-xl border border-ts-line bg-ts-paper p-6 shadow-ts-card">
              <div className="flex items-center gap-3 border-b border-ts-line-soft pb-4">
                <BriefcaseBusiness size={17} className="shrink-0 text-ts-accent-deep" />
                <span className="block h-3 w-2/5 rounded-ts-xs bg-ts-surface-2" />
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {[
                  arabic ? "طلب جديد" : "New applicant",
                  arabic ? "القائمة المختصرة" : "Shortlisted",
                  arabic ? "مقابلة" : "Interview",
                  arabic ? "عرض وظيفي" : "Offer"
                ].map((stage) => (
                  <li key={stage} className="flex items-center gap-3.5 border-b border-ts-line-soft py-4 last:border-b-0">
                    <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-on-primary-tint">
                      <UsersRound size={16} />
                    </span>
                    <span className="block h-2.5 min-w-0 flex-1 rounded-ts-xs bg-ts-surface-2" />
                    <span className="shrink-0 text-[13px] font-medium text-ts-muted">{stage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <span className="grid size-11 place-items-center rounded-ts-md border border-ts-line-soft bg-ts-accent-tint text-ts-accent-deep">
              <BriefcaseBusiness size={20} aria-hidden="true" />
            </span>
            <Eyebrow className="mt-5">{arabic ? "لأصحاب العمل" : "For employers"}</Eyebrow>
            <h2 className="m-0 mt-3 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ts-ink">{copy.sections.employerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[16px] leading-relaxed text-pretty text-ts-muted">{copy.sections.employerBody}</p>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {[
                arabic ? "الوظائف والمتقدمون في شاشة واحدة" : "Jobs and applicants in one view",
                arabic ? "مراحل توظيف واضحة يتشاركها فريقك" : "A clear, collaborative pipeline",
                arabic ? "مطابقة المواهب بالذكاء الاصطناعي" : "AI-assisted talent matching"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-ts-ink">
                  <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-ts-accent-tint text-ts-accent-deep">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/login?mode=signup" className={`${buttonQuiet} mt-8 w-full min-[520px]:w-auto`}>
              {copy.sections.start} <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>
        </Container>
      </section>

      {/* How it works — numbered, no boxes; the rhythm carries it. */}
      <section className={sectionPad}>
        <Container>
          <SectionHeading
            eyebrow={arabic ? "كيف تعمل المنصة" : "How it works"}
            title={arabic ? "ثلاث خطوات، لا أكثر." : "Three steps, nothing more."}
            body={arabic ? "من ملفك المهني حتى العرض الوظيفي، بمسار واضح." : "From profile to offer, on a path you can actually follow."}
            align="center"
          />
          <ol className="m-0 mt-11 grid list-none grid-cols-1 gap-x-10 gap-y-9 p-0 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="min-w-0 border-t border-ts-line pt-6">
                  <div className="flex items-center gap-3">
                    <Icon size={18} aria-hidden="true" className="shrink-0 text-ts-primary" />
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-ts-subtle uppercase">
                      {arabic ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
                    </span>
                  </div>
                  <h3 className="m-0 mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ts-ink">{step.title}</h3>
                  <p className="m-0 mt-2 text-[15px] leading-relaxed text-pretty text-ts-muted">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <CtaBand locale={locale} />
      <PublicFooter locale={locale} />
    </main>
  );
}

/** The hero's floating card: one live featured role, linked to its page. */
function HeroJobCard({ job, locale }: { job: PublicJob; locale: Locale }) {
  const arabic = locale === "ar";
  const salary = job.salaryMin || job.salaryMax ? salaryLabel(job.salaryMin, job.salaryMax, job.currency, locale) : null;
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5 rounded-ts-md max-[559px]:hidden bg-ts-surface p-4 shadow-ts-lift transition-transform hover:-translate-y-0.5 min-[560px]:inset-x-auto min-[560px]:end-5 min-[560px]:bottom-5 min-[560px]:w-80 min-[1000px]:-start-10 min-[1000px]:end-auto min-[1000px]:bottom-10"
    >
      <span className="flex items-center gap-3">
        <CompanyAvatar name={companyName(job, locale)} logoUrl={job.company.logoUrl} size="sm" />
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-[15px] font-semibold text-ts-ink [unicode-bidi:plaintext]">{jobTitle(job, locale)}</strong>
          <span className="flex items-center gap-1 text-[13px] text-ts-muted">
            <span className="min-w-0 truncate">{companyName(job, locale)}</span>
            {job.company.verified ? <VerifiedBadge locale={locale} size={13} /> : null}
          </span>
        </span>
      </span>
      {salary ? <span className="text-sm font-semibold text-ts-accent-deep">{salary}</span> : null}
      {job.easyApply ? (
        <span className="mt-1 inline-flex h-7 w-fit items-center rounded-ts-chip bg-ts-primary-tint px-2.5 text-[12px] font-semibold text-ts-on-primary-tint">
          {arabic ? "تقديم سريع" : "Easy Apply"}
        </span>
      ) : null}
    </Link>
  );
}

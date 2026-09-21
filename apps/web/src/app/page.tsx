import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, FileText, MessagesSquare, Search, UsersRound } from "lucide-react";
import type { Route } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicJobCard } from "@/components/public/job-card";
import { JobSearchForm } from "@/components/public/job-search-form";
import { Container, CtaBand, PublicFooter, SectionHeading } from "@/components/public/public-shell";
import { companiesByOpenRoles } from "@/data/companies";
import { jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { dictionary, isLocale } from "@/lib/i18n";

/* The public home page runs on a quieter system than the workspace: hairline
   edges, one accent, semibold (never bold) headings, and fluid clamp() rhythm
   so the layout breathes rather than snapping between breakpoints. */
const buttonPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ts-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ts-primary-deep";
const buttonQuiet =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ts-line bg-ts-surface px-6 text-[15px] font-semibold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep";
const eyebrow = "m-0 text-[11px] font-semibold tracking-[0.18em] text-ts-primary-deep uppercase";
const sectionPad = "py-[clamp(3.5rem,8vw,6.5rem)]";

export default async function HomePage() {
  const [cookieStore, user] = await Promise.all([cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const copy = dictionary[locale];
  const arabic = locale === "ar";

  const featured = [...jobs].sort((a, b) => a.postedDays - b.postedDays).slice(0, 3);
  const hiring = companiesByOpenRoles().slice(0, 6);
  const categories = [...new Set(jobs.map((job) => job.category))].map((category) => ({
    category,
    count: jobs.filter((job) => job.category === category).length
  }));

  const steps = [
    { icon: FileText, title: arabic ? "أنشئ ملفك" : "Build one profile", body: arabic ? "ارفع سيرتك الذاتية مرة واحدة ودعها تتحدث عنك في كل طلب." : "Upload your CV once and let it carry into every application." },
    { icon: Search, title: arabic ? "اكتشف الفرص" : "See roles that fit", body: arabic ? "نرتب الوظائف حسب توافقها مع خبرتك وتفضيلاتك." : "Roles are ranked against your experience and preferences, not the noise." },
    { icon: MessagesSquare, title: arabic ? "تابع كل شيء" : "Track every reply", body: arabic ? "تابع المقابلات والرسائل والعروض في مكان واحد." : "Interviews, messages, and offers stay in one place you can follow." }
  ];

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      {/* Hero: light ground, the photograph framed rather than flooded, and the
          search bar as the single loudest element on the page. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(70%_100%_at_50%_0%,var(--ts-primary-tint)_0%,transparent_72%)] opacity-70"
        />
        <Container className="relative grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(2.5rem,5vw,4rem)] min-[1000px]:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <p className={`${eyebrow} inline-flex items-center gap-2.5`}>
              <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ts-accent" />
              {copy.hero.eyebrow}
            </p>
            <h1 className="m-0 mt-5 text-[clamp(2.3rem,5.6vw,4.1rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-ts-ink">
              {copy.hero.titleStart}
              <br />
              <em className="font-serif font-normal text-ts-primary italic">{copy.hero.titleAccent}</em>
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

            <div className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2.5">
              <span className="text-[13px] text-ts-subtle">{arabic ? "الأكثر بحثاً" : "Popular"}</span>
              {categories.slice(0, 5).map((item) => (
                <Link
                  key={item.category}
                  href={`/jobs?category=${encodeURIComponent(item.category)}` as Route}
                  className="text-[14px] font-medium text-ts-ink underline decoration-ts-line underline-offset-[6px] transition-colors hover:text-ts-primary hover:decoration-ts-primary"
                >
                  {item.category}
                </Link>
              ))}
            </div>
          </div>

          {/* Framed photograph with one quiet product detail resting on it. */}
          <div className="relative aspect-[5/4] w-full min-w-0 overflow-hidden rounded-ts-xl border border-ts-line-soft bg-ts-surface-2 max-[1000px]:order-first min-[1000px]:aspect-[7/8]">
            <Image
              className="object-cover"
              src="/images/talentsouq-hero.webp"
              alt="Professionals collaborating in a contemporary Gulf workplace"
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 46vw"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,27,35,0)_45%,rgba(11,27,35,0.6)_100%)]" />
            {/* The one product detail in the hero: a caption on the gradient,
                not a panel — a filled card here reads as a milky slab. */}
            <div className="absolute inset-x-5 bottom-5 flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex h-7 shrink-0 items-center rounded-full bg-ts-primary px-2.5 text-[12px] font-semibold text-white">
                92%
              </span>
              <span className="min-w-0 [text-shadow:0_1px_12px_rgba(11,27,35,0.55)]">
                <strong className="block truncate text-sm font-semibold text-white">Senior Product Designer</strong>
                <span className="block truncate text-[13px] text-white/75">{arabic ? "توافق قوي · دبي" : "Strong match · Dubai"}</span>
              </span>
            </div>
          </div>
        </Container>

        {/* Proof, stated once and quietly. */}
        <Container>
          <div className="flex flex-wrap items-baseline gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-5 border-t border-ts-line-soft py-8">
            <p className={`${eyebrow} w-full min-[900px]:w-auto`}>{copy.proof.label}</p>
            {[
              { value: "500+", label: copy.proof.jobs },
              { value: "120+", label: copy.proof.companies },
              { value: "01", label: copy.proof.response }
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2.5">
                <strong className="text-xl font-semibold tracking-[-0.02em] text-ts-ink">{stat.value}</strong>
                <span className="text-[13px] text-ts-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Who is hiring — a quiet marquee row, not a wall of chips. */}
      <section className="border-y border-ts-line-soft bg-ts-surface py-7">
        <Container className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:gap-x-9">
          <p className={eyebrow}>{arabic ? "يوظفون الآن" : "Hiring right now"}</p>
          <div className="-mx-5 flex items-center gap-x-7 gap-y-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:flex-wrap min-[900px]:overflow-visible min-[900px]:px-0">
            {hiring.map(({ company, openRoles }) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}` as Route}
                className="group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap"
              >
                <span aria-hidden="true" className="grid size-7 place-items-center rounded-ts-sm text-[11px] font-semibold text-ts-ink/75" style={{ backgroundColor: company.accent }}>
                  {company.initials}
                </span>
                <span className="text-sm font-medium text-ts-ink transition-colors group-hover:text-ts-primary">{company.name}</span>
                <span className="text-[13px] text-ts-subtle">{openRoles}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured roles */}
      <section className={sectionPad}>
        <Container>
          <SectionHeading
            eyebrow={copy.sections.jobsEyebrow}
            title={copy.sections.jobsTitle}
            body={copy.sections.jobsBody}
            action={{ href: "/jobs", label: copy.sections.viewAll }}
          />
          <div className="mt-10 grid grid-cols-1 gap-5 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
            {featured.map((job) => (
              <PublicJobCard key={job.id} job={job} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* Browse by function — a hairline list, fluid across widths. */}
      <section className={`border-y border-ts-line-soft bg-ts-surface ${sectionPad}`}>
        <Container>
          <SectionHeading
            eyebrow={arabic ? "تصفح المجالات" : "Browse by function"}
            title={arabic ? "ابدأ من مجالك." : "Start where you already work."}
            body={arabic ? "كل مجال يعرض الوظائف المفتوحة اليوم في الخليج." : "Every function shows what is genuinely open across the Gulf today."}
          />
          <div className="mt-9 grid gap-x-10 border-t border-ts-line [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]">
            {categories.map((item) => (
              <Link
                key={item.category}
                href={`/jobs?category=${encodeURIComponent(item.category)}` as Route}
                className="group flex items-center justify-between gap-4 border-b border-ts-line py-5 transition-colors hover:border-ts-primary"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-medium text-ts-ink transition-colors group-hover:text-ts-primary">{item.category}</span>
                  <span className="mt-0.5 block text-[13px] text-ts-subtle">
                    {item.count} {arabic ? "وظيفة" : item.count === 1 ? "open role" : "open roles"}
                  </span>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" className="shrink-0 text-ts-subtle transition-colors group-hover:text-ts-primary rtl:-scale-x-100" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* For talent */}
      <section className={sectionPad} id="talent">
        <Container className="grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4.5rem)] min-[1000px]:grid-cols-2">
          <div className="order-2 min-w-0 min-[1000px]:order-1">
            <span className="grid size-11 place-items-center rounded-ts-md border border-ts-line-soft bg-ts-primary-tint text-ts-primary-deep">
              <UsersRound size={20} aria-hidden="true" />
            </span>
            <p className={`${eyebrow} mt-5`}>{arabic ? "للباحثين عن عمل" : "For talent"}</p>
            <h2 className="m-0 mt-3 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ts-ink">{copy.sections.seekerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[16px] leading-relaxed text-pretty text-ts-muted">{copy.sections.seekerBody}</p>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {[
                arabic ? "ملف مهني متكامل" : "One complete professional profile",
                arabic ? "توصيات وظائف أذكى" : "Smarter role recommendations",
                arabic ? "تتبع واضح للطلبات" : "Clear application tracking"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-ts-ink">
                  <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-ts-primary-deep">
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

          {/* Profile mock */}
          <div className="order-1 min-w-0 min-[1000px]:order-2">
            <div className="rounded-ts-xl border border-ts-line bg-ts-surface p-6 shadow-ts-card">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#e8d6d2] text-sm font-semibold text-[#7b453b]">
                  SA
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[15px] font-semibold text-ts-ink">Sarah Ahmed</strong>
                  <span className="block text-[13px] text-ts-muted">Senior Product Designer</span>
                </div>
                <span className="inline-flex h-8 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-semibold text-ts-primary-deep">92%</span>
              </div>
              <div className="mt-6 flex flex-col gap-2" aria-hidden="true">
                <span className="block h-2 w-full rounded-full bg-ts-surface-2" />
                <span className="block h-2 w-3/5 rounded-full bg-ts-surface-2" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Product strategy", "Research", "Design systems"].map((skill) => (
                  <span key={skill} className="inline-flex h-7 items-center rounded-full border border-ts-line px-3 text-[13px] text-ts-muted">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-ts-line-soft pt-5">
                <span className="flex-1 text-[13px] text-ts-muted">{arabic ? "قوة الملف" : "Profile strength"}</span>
                <span aria-hidden="true" className="h-1.5 w-24 overflow-hidden rounded-full bg-ts-surface-2">
                  <span className="block h-full w-[86%] rounded-full bg-ts-primary" />
                </span>
                <strong className="text-[13px] font-semibold text-ts-primary-deep">{arabic ? "ممتاز" : "Excellent"}</strong>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-ts-lg border border-ts-line bg-ts-surface px-4 py-3 shadow-ts-card">
              <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-ts-success-tint text-ts-success">
                <Check size={14} strokeWidth={2.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-ts-muted">{arabic ? "تم إرسال الطلب" : "Application sent"}</span>
                <strong className="block text-sm font-semibold text-ts-ink">Nexa Commerce</strong>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* For employers */}
      <section className={`border-y border-ts-line-soft bg-ts-surface ${sectionPad}`} id="employers">
        <Container className="grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,4.5rem)] min-[1000px]:grid-cols-2">
          {/* Pipeline mock */}
          <div className="min-w-0">
            <div className="rounded-ts-xl border border-ts-line bg-ts-paper p-6 shadow-ts-card">
              <div className="flex items-center justify-between gap-3 border-b border-ts-line-soft pb-4">
                <strong className="text-[15px] font-semibold text-ts-ink">Product Designer</strong>
                <span className="text-[13px] text-ts-muted">24 {arabic ? "متقدم" : "applicants"}</span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {[
                  { initials: "MA", name: "Maya Alami", stage: arabic ? "طلب جديد" : "New applicant", score: "95%", tone: "bg-[#e6f4f1] text-[#0B5A51]" },
                  { initials: "LK", name: "Liam Khan", stage: arabic ? "قائمة مختصرة" : "Shortlisted", score: "91%", tone: "bg-[#fdf0e4] text-[#8A4B0A]" },
                  { initials: "NO", name: "Noor Omar", stage: arabic ? "مقابلة" : "Interview", score: "88%", tone: "bg-[#ecebf7] text-[#464396]" }
                ].map((row) => (
                  <li key={row.name} className="flex items-center gap-3.5 border-b border-ts-line-soft py-4 last:border-b-0">
                    <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${row.tone}`}>
                      {row.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-semibold text-ts-ink">{row.name}</strong>
                      <span className="block text-[13px] text-ts-muted">{row.stage}</span>
                    </span>
                    <span className="text-[13px] font-semibold text-ts-primary-deep">{row.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <span className="grid size-11 place-items-center rounded-ts-md border border-ts-line-soft bg-ts-accent-tint text-ts-accent-deep">
              <BriefcaseBusiness size={20} aria-hidden="true" />
            </span>
            <p className={`${eyebrow} mt-5`}>{arabic ? "لأصحاب العمل" : "For employers"}</p>
            <h2 className="m-0 mt-3 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ts-ink">{copy.sections.employerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[16px] leading-relaxed text-pretty text-ts-muted">{copy.sections.employerBody}</p>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {[
                arabic ? "إدارة الوظائف والمتقدمين" : "Jobs and applicants in one view",
                arabic ? "مراحل توظيف واضحة" : "A clear, collaborative pipeline",
                arabic ? "توافق مدعوم بالذكاء الاصطناعي" : "AI-assisted talent matching"
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
            eyebrow={arabic ? "كيف يعمل" : "How it works"}
            title={arabic ? "ثلاث خطوات، لا أكثر." : "Three steps, nothing more."}
            body={arabic ? "من الملف الشخصي إلى العرض، بمسار واضح." : "From profile to offer, on a path you can actually follow."}
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

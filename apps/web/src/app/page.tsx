import { ArrowRight, BriefcaseBusiness, Check, FileText, LineChart, MessagesSquare, Search, Sparkles, UsersRound } from "lucide-react";
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
      {/* Hero: the image carries the region, the search bar carries the intent. */}
      <section className="relative isolate overflow-hidden bg-ts-ink">
        <Image
          className="absolute inset-0 -z-10 object-cover"
          src="/images/talentsouq-hero.webp"
          alt="Professionals collaborating in a contemporary Gulf workplace"
          fill
          priority
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(6,29,36,0.96)_0%,rgba(6,29,36,0.9)_38%,rgba(6,29,36,0.45)_70%,rgba(6,29,36,0.25)_100%)]"
        />
        <PublicHeader locale={locale} theme={theme} overlay user={user} />

        <Container className="pt-40 pb-16 max-[900px]:pt-32 max-[680px]:pt-28 max-[680px]:pb-10">
          <div className="max-w-3xl">
            <p className="m-0 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-white uppercase backdrop-blur">
              <Sparkles size={15} aria-hidden="true" className="text-ts-accent" />
              {copy.hero.eyebrow}
            </p>
            <h1 className="m-0 mt-7 text-[clamp(2.9rem,6.4vw,5.2rem)] leading-[0.98] font-bold tracking-[-0.04em] text-white">
              {copy.hero.titleStart}
              <br />
              <em className="font-serif font-normal text-[#F5DCB9] italic">{copy.hero.titleAccent}</em>
            </h1>
            <p className="m-0 mt-6 max-w-xl text-[19px] leading-relaxed text-white/75">{copy.hero.body}</p>
          </div>

          <JobSearchForm locale={locale} tone="hero" className="mt-9 max-w-4xl" />

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 text-base font-bold text-ts-ink transition-transform hover:-translate-y-0.5"
            >
              <Search size={18} aria-hidden="true" />
              {copy.hero.find}
            </Link>
            <Link
              href="/#employers"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/30 px-7 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              {copy.hero.hire}
              <ArrowRight size={18} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white/60">{arabic ? "الأكثر بحثاً" : "Popular"}</span>
            {categories.slice(0, 5).map((item) => (
              <Link
                key={item.category}
                href={`/jobs?category=${encodeURIComponent(item.category)}` as Route}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-[13px] font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.category}
                <span className="text-white/50">{item.count}</span>
              </Link>
            ))}
          </div>
        </Container>

        <div className="border-t border-white/15">
          <Container className="flex flex-wrap items-center gap-x-14 gap-y-6 py-8">
            <p className="m-0 text-xs font-bold tracking-[0.12em] text-white/50 uppercase">{copy.proof.label}</p>
            {[
              { value: "500+", label: copy.proof.jobs },
              { value: "120+", label: copy.proof.companies },
              { value: "01", label: copy.proof.response }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <strong className="text-2xl leading-none font-bold tracking-[-0.03em] text-white">{stat.value}</strong>
                <span className="text-[13px] text-white/60">{stat.label}</span>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* Who is hiring — real companies from the job data. */}
      <section className="border-b border-ts-line bg-ts-surface py-10">
        <Container className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-muted uppercase">{arabic ? "يوظفون الآن" : "Hiring right now"}</p>
          <div className="flex flex-wrap items-center gap-3">
            {hiring.map(({ company, openRoles }) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}` as Route}
                className="inline-flex items-center gap-2.5 rounded-full border border-ts-line px-4 py-2 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40"
              >
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-ts-sm text-xs font-bold text-ts-ink/80" style={{ backgroundColor: company.accent }}>
                  {company.initials}
                </span>
                <span className="text-sm font-bold text-ts-ink">{company.name}</span>
                <span className="text-[13px] font-semibold text-ts-muted">{openRoles}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured roles */}
      <section className="py-20 max-[680px]:py-14">
        <Container>
          <SectionHeading
            eyebrow={copy.sections.jobsEyebrow}
            title={copy.sections.jobsTitle}
            body={copy.sections.jobsBody}
            action={{ href: "/jobs", label: copy.sections.viewAll }}
          />
          <div className="mt-10 grid gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
            {featured.map((job) => (
              <PublicJobCard key={job.id} job={job} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* Browse by function */}
      <section className="border-y border-ts-line bg-ts-surface py-16 max-[680px]:py-12">
        <Container>
          <SectionHeading
            eyebrow={arabic ? "تصفح المجالات" : "Browse by function"}
            title={arabic ? "ابدأ من مجالك." : "Start where you already work."}
            body={arabic ? "كل مجال يعرض الوظائف المفتوحة اليوم في الخليج." : "Every function shows what is genuinely open across the Gulf today."}
          />
          <div className="mt-8 grid gap-4 min-[560px]:grid-cols-2 min-[1100px]:grid-cols-5">
            {categories.map((item) => (
              <Link
                key={item.category}
                href={`/jobs?category=${encodeURIComponent(item.category)}` as Route}
                className="group flex items-center justify-between gap-3 rounded-ts-lg border border-ts-line bg-ts-paper px-5 py-5 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40"
              >
                <span className="min-w-0">
                  <span className="block text-[17px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{item.category}</span>
                  <span className="mt-1 block text-[13px] text-ts-muted">
                    {item.count} {arabic ? "وظيفة" : item.count === 1 ? "open role" : "open roles"}
                  </span>
                </span>
                <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-ts-muted transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* For talent */}
      <section className="py-20 max-[680px]:py-14" id="talent">
        <Container className="grid items-center gap-14 min-[1000px]:grid-cols-2">
          <div className="order-2 min-w-0 min-[1000px]:order-1">
            <span className="grid size-14 place-items-center rounded-ts-lg bg-ts-primary-tint text-ts-primary">
              <UsersRound size={26} aria-hidden="true" />
            </span>
            <p className="m-0 mt-6 text-xs font-bold tracking-[0.12em] text-ts-primary uppercase">{arabic ? "للباحثين عن عمل" : "For talent"}</p>
            <h2 className="m-0 mt-3 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08] font-bold tracking-[-0.03em] text-ts-ink">{copy.sections.seekerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[17px] leading-relaxed text-ts-muted">{copy.sections.seekerBody}</p>
            <ul className="m-0 mt-7 flex list-none flex-col gap-3.5 p-0">
              {[
                arabic ? "ملف مهني متكامل" : "One complete professional profile",
                arabic ? "توصيات وظائف أذكى" : "Smarter role recommendations",
                arabic ? "تتبع واضح للطلبات" : "Clear application tracking"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-semibold text-ts-ink">
                  <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-ts-primary text-white">
                    <Check size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/login?mode=signup"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-ts-primary px-7 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {copy.sections.start} <ArrowRight size={18} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>

          {/* Profile mock */}
          <div className="relative order-1 min-w-0 min-[1000px]:order-2">
            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-[#bb7568] text-lg font-bold text-white">
                  SA
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block text-base font-bold text-ts-ink">Sarah Ahmed</strong>
                  <span className="block text-[13px] text-ts-muted">Senior Product Designer</span>
                </div>
                <span className="inline-flex h-9 items-center rounded-full bg-ts-primary-tint px-3.5 text-sm font-bold text-ts-primary-deep">92%</span>
              </div>
              <div className="mt-6 flex flex-col gap-2.5" aria-hidden="true">
                <span className="block h-2.5 w-full rounded-full bg-ts-surface-2" />
                <span className="block h-2.5 w-3/5 rounded-full bg-ts-surface-2" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Product strategy", "Research", "Design systems"].map((skill) => (
                  <span key={skill} className="inline-flex h-8 items-center rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-muted">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-ts-line pt-5">
                <LineChart size={18} aria-hidden="true" className="shrink-0 text-ts-primary" />
                <span className="flex-1 text-[13px] text-ts-muted">{arabic ? "قوة الملف" : "Profile strength"}</span>
                <strong className="text-sm font-bold text-ts-success">{arabic ? "ممتاز" : "Excellent"}</strong>
              </div>
            </div>
            <div className="absolute -bottom-6 end-6 flex items-center gap-3 rounded-ts-md border border-ts-line bg-ts-surface px-4 py-3 shadow-lg">
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-ts-success-tint text-ts-success">
                <Check size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-ts-muted">{arabic ? "تم إرسال الطلب" : "Application sent"}</span>
                <strong className="block text-sm font-bold text-ts-ink">Nexa Commerce</strong>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* For employers */}
      <section className="border-y border-ts-line bg-ts-surface py-20 max-[680px]:py-14" id="employers">
        <Container className="grid items-center gap-14 min-[1000px]:grid-cols-2">
          {/* Pipeline mock */}
          <div className="relative min-w-0">
            <div className="rounded-ts-lg border border-ts-line bg-ts-paper p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-ts-line pb-4">
                <strong className="text-base font-bold text-ts-ink">Product Designer</strong>
                <span className="text-[13px] font-semibold text-ts-muted">24 {arabic ? "متقدم" : "applicants"}</span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {[
                  { initials: "MA", name: "Maya Alami", stage: arabic ? "طلب جديد" : "New applicant", score: "95%", tone: "bg-[#e6f4f1] text-[#0B5A51]" },
                  { initials: "LK", name: "Liam Khan", stage: arabic ? "قائمة مختصرة" : "Shortlisted", score: "91%", tone: "bg-[#fff0e5] text-[#8A4B0A]" },
                  { initials: "NO", name: "Noor Omar", stage: arabic ? "مقابلة" : "Interview", score: "88%", tone: "bg-[#ecebff] text-[#4338ca]" }
                ].map((row) => (
                  <li key={row.name} className="flex items-center gap-3.5 border-b border-ts-line py-4 last:border-b-0">
                    <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${row.tone}`}>
                      {row.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-bold text-ts-ink">{row.name}</strong>
                      <span className="block text-[13px] text-ts-muted">{row.stage}</span>
                    </span>
                    <b className="text-sm font-bold text-ts-primary">{row.score}</b>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -top-5 end-6 inline-flex items-center gap-2 rounded-full bg-ts-ink px-4 py-2.5 text-[13px] font-bold text-white shadow-lg">
              <Sparkles size={15} aria-hidden="true" className="text-ts-accent" />
              {arabic ? "أفضل المرشحين جاهزون" : "Top matches ready"}
            </div>
          </div>

          <div className="min-w-0">
            <span className="grid size-14 place-items-center rounded-ts-lg bg-ts-accent-tint text-ts-accent-deep">
              <BriefcaseBusiness size={26} aria-hidden="true" />
            </span>
            <p className="m-0 mt-6 text-xs font-bold tracking-[0.12em] text-ts-accent-deep uppercase">{arabic ? "لأصحاب العمل" : "For employers"}</p>
            <h2 className="m-0 mt-3 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08] font-bold tracking-[-0.03em] text-ts-ink">{copy.sections.employerTitle}</h2>
            <p className="m-0 mt-4 max-w-xl text-[17px] leading-relaxed text-ts-muted">{copy.sections.employerBody}</p>
            <ul className="m-0 mt-7 flex list-none flex-col gap-3.5 p-0">
              {[
                arabic ? "إدارة الوظائف والمتقدمين" : "Jobs and applicants in one view",
                arabic ? "مراحل توظيف واضحة" : "A clear, collaborative pipeline",
                arabic ? "توافق مدعوم بالذكاء الاصطناعي" : "AI-assisted talent matching"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-semibold text-ts-ink">
                  <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-ts-accent text-white">
                    <Check size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/login?mode=signup"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-ts-ink px-7 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {copy.sections.start} <ArrowRight size={18} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 max-[680px]:py-14">
        <Container>
          <SectionHeading
            eyebrow={arabic ? "كيف يعمل" : "How it works"}
            title={arabic ? "ثلاث خطوات، لا أكثر." : "Three steps, nothing more."}
            body={arabic ? "من الملف الشخصي إلى العرض، بمسار واضح." : "From profile to offer, on a path you can actually follow."}
            align="center"
          />
          <ol className="m-0 mt-12 grid list-none gap-6 p-0 min-[760px]:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative rounded-ts-lg border border-ts-line bg-ts-surface p-7">
                  <span className="grid size-12 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="mt-5 block text-xs font-bold tracking-[0.12em] text-ts-muted uppercase">
                    {arabic ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
                  </span>
                  <h3 className="m-0 mt-2 text-xl font-bold tracking-[-0.02em] text-ts-ink">{step.title}</h3>
                  <p className="m-0 mt-2.5 text-[15px] leading-relaxed text-ts-muted">{step.body}</p>
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

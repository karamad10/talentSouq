import { ArrowRight, BriefcaseBusiness, Check, Search, Sparkles, UsersRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { Logo } from "@/components/logo";
import { PublicHeader } from "@/components/public-header";
import { jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { dictionary, isLocale } from "@/lib/i18n";

export default async function HomePage() {
  const [cookieStore, user] = await Promise.all([cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const copy = dictionary[locale];

  return (
    <main>
      <section className="hero">
        <Image className="hero-image" src="/images/talentsouq-hero.webp" alt="Professionals collaborating in a contemporary Gulf workplace" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <PublicHeader locale={locale} theme={theme} overlay user={user} />
        <div className="container hero-content">
          <p className="eyebrow hero-eyebrow"><Sparkles size={16} aria-hidden="true" />{copy.hero.eyebrow}</p>
          <h1>{copy.hero.titleStart}<br /><em>{copy.hero.titleAccent}</em></h1>
          <p className="hero-copy">{copy.hero.body}</p>
          <div className="hero-actions">
            <Link className="button button-coral" href="/jobs"><Search size={18} aria-hidden="true" />{copy.hero.find}</Link>
            <Link className="button button-ghost" href="/#employers">{copy.hero.hire}<ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="container hero-foot">
          <p>{copy.proof.label}</p>
          <div><strong>500+</strong><span>{copy.proof.jobs}</span></div>
          <div><strong>120+</strong><span>{copy.proof.companies}</span></div>
          <div><strong>01</strong><span>{copy.proof.response}</span></div>
        </div>
      </section>

      <section className="section jobs-section">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">{copy.sections.jobsEyebrow}</p><h2>{copy.sections.jobsTitle}</h2></div>
            <div><p>{copy.sections.jobsBody}</p><Link className="arrow-link" href="/jobs">{copy.sections.viewAll}<ArrowRight size={18} /></Link></div>
          </div>
          <div className="job-grid">{jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} />)}</div>
        </div>
      </section>

      <section className="split-section" id="companies">
        <div className="split-visual seeker-visual">
          <div className="profile-sheet">
            <div className="profile-top"><span className="avatar avatar-photo">SA</span><div><strong>Sarah Ahmed</strong><small>Senior Product Designer</small></div><span className="match-ring">92%</span></div>
            <div className="profile-line wide" /><div className="profile-line" />
            <div className="skill-row"><span>Product strategy</span><span>Research</span><span>Design systems</span></div>
            <div className="profile-progress"><i /><span>Profile strength</span><strong>Excellent</strong></div>
          </div>
          <div className="floating-note"><Check size={17} /><span>Application sent</span><strong>Nexa Commerce</strong></div>
        </div>
        <div className="split-copy">
          <span className="feature-icon"><UsersRound /></span>
          <p className="eyebrow">{locale === "ar" ? "للباحثين عن عمل" : "For talent"}</p>
          <h2>{copy.sections.seekerTitle}</h2>
          <p>{copy.sections.seekerBody}</p>
          <ul className="feature-list">
            <li><Check size={18} />{locale === "ar" ? "ملف مهني متكامل" : "One complete professional profile"}</li>
            <li><Check size={18} />{locale === "ar" ? "توصيات وظائف أذكى" : "Smarter role recommendations"}</li>
            <li><Check size={18} />{locale === "ar" ? "تتبع واضح للطلبات" : "Clear application tracking"}</li>
          </ul>
          <Link className="arrow-link" href="/auth/login?mode=signup">{copy.sections.start}<ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="split-section split-reverse" id="employers">
        <div className="split-copy employer-copy">
          <span className="feature-icon orange"><BriefcaseBusiness /></span>
          <p className="eyebrow">{locale === "ar" ? "لأصحاب العمل" : "For employers"}</p>
          <h2>{copy.sections.employerTitle}</h2>
          <p>{copy.sections.employerBody}</p>
          <ul className="feature-list">
            <li><Check size={18} />{locale === "ar" ? "إدارة الوظائف والمتقدمين" : "Jobs and applicants in one view"}</li>
            <li><Check size={18} />{locale === "ar" ? "مراحل توظيف واضحة" : "A clear, collaborative pipeline"}</li>
            <li><Check size={18} />{locale === "ar" ? "توافق مدعوم بالذكاء الاصطناعي" : "AI-assisted talent matching"}</li>
          </ul>
          <Link className="arrow-link" href="/auth/login?mode=signup">{copy.sections.start}<ArrowRight size={18} /></Link>
        </div>
        <div className="split-visual employer-visual">
          <div className="pipeline">
            <div className="pipeline-head"><strong>Product Designer</strong><span>24 applicants</span></div>
            {["New applicants", "Shortlisted", "Interview"].map((label, index) => <div className="pipeline-row" key={label}><span className={`candidate-dot dot-${index + 1}`}>{["MA", "LK", "NO"][index]}</span><div><strong>{["Maya Alami", "Liam Khan", "Noor Omar"][index]}</strong><small>{label}</small></div><b>{["95%", "91%", "88%"][index]}</b></div>)}
          </div>
          <div className="ai-chip"><Sparkles size={16} />Top matches ready</div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner"><div><p className="eyebrow">TalentSouq</p><h2>{copy.sections.finalTitle}</h2><p>{copy.sections.finalBody}</p></div><Link className="button button-coral" href="/auth/login?mode=signup">{copy.sections.start}<ArrowRight size={18} /></Link></div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid"><div><Logo inverted /><p>{copy.footer.tagline}</p></div><div><strong>{copy.footer.product}</strong><Link href="/jobs">{copy.nav.jobs}</Link><Link href="/#employers">{copy.nav.forEmployers}</Link></div><div><strong>{copy.footer.legal}</strong><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div className="footer-meta"><span>Dubai · Riyadh · Doha</span><span>© 2026 TalentSouq</span></div></div>
      </footer>
    </main>
  );
}

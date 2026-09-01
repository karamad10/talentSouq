import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { cookies } from "next/headers";
import { JobCard } from "@/components/job-card";
import { PublicHeader } from "@/components/public-header";
import { jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Find jobs", description: "Explore open opportunities across the Gulf." };

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string; location?: string }> }) {
  const [{ q = "", location = "" }, cookieStore, user] = await Promise.all([searchParams, cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const query = `${q} ${location}`.trim().toLowerCase();
  const filteredJobs = !query ? jobs : jobs.filter((job) => `${job.title} ${job.company} ${job.location} ${job.category}`.toLowerCase().includes(query));

  return <main className="page-shell">
    <PublicHeader locale={locale} theme={theme} user={user} />
    <section className="jobs-hero"><div className="container"><p className="eyebrow">{locale === "ar" ? "فرصتك القادمة" : "Your next opportunity"}</p><h1>{locale === "ar" ? "اعثر على عمل يناسب طموحك." : "Find work that fits your ambition."}</h1>
      <form className="job-search" role="search"><label><Search size={19} /><span className="sr-only">Search jobs</span><input name="q" defaultValue={q} placeholder={locale === "ar" ? "المسمى الوظيفي أو الشركة" : "Role, skill, or company"} /></label><label><span className="sr-only">Location</span><input name="location" defaultValue={location} placeholder={locale === "ar" ? "الموقع" : "City or country"} /></label><button className="button button-primary" type="submit">{locale === "ar" ? "بحث" : "Search jobs"}</button></form>
    </div></section>
    <section className="section jobs-index"><div className="container"><div className="results-head"><div><span>{filteredJobs.length} {locale === "ar" ? "وظائف" : "open roles"}</span><p>{locale === "ar" ? "فرص مختارة من شركات متنامية" : "Curated opportunities from growing teams"}</p></div><button className="filter-button" type="button"><SlidersHorizontal size={17} />{locale === "ar" ? "التصفية" : "Filters"}</button></div>
      {filteredJobs.length ? <div className="job-grid job-grid-index">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="empty-state"><Search size={32} /><h2>No roles found</h2><p>Try a broader title, company, or location.</p></div>}
    </div></section>
  </main>;
}

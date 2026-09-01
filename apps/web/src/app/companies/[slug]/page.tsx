import type { Metadata } from "next";
import { ArrowLeft, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { PublicHeader } from "@/components/public-header";
import { companies, getCompany, getCompanyJobs } from "@/data/companies";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() { return companies.map((company) => ({ slug: company.slug })); }

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
  const companyJobs = getCompanyJobs(company.name);
  return <main className="page-shell"><PublicHeader locale={locale} theme={theme} user={user} /><div className="container detail-wrap"><Link className="back-link" href="/companies"><ArrowLeft size={17} />Back to companies</Link><section className="company-hero-detail"><div className="company-mark detail-mark" style={{ backgroundColor: company.accent }}>{company.initials}</div><p className="eyebrow">{company.industry}</p><h1>{company.name}</h1><p>{company.summary}</p><span><MapPin size={16} />{company.location}</span></section><section className="workspace-section"><div className="panel-title"><h2>What they value</h2></div><div className="value-grid">{company.values.map((value) => <span key={value}>{value}</span>)}</div></section><section className="workspace-section"><div className="panel-title"><div><h2>Open roles</h2><p>Public jobs are using demo data until Supabase is connected.</p></div></div>{companyJobs.length ? <div className="job-grid">{companyJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="empty-state"><h2>No open roles yet</h2><p>Check back soon for new opportunities.</p></div>}</section></div></main>;
}

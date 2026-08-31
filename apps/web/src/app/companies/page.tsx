import type { Metadata } from "next";
import type { Route } from "next";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { companies } from "@/data/companies";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Companies", description: "Explore growing teams hiring through TalentSouq." };

export default async function CompaniesPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  return <main className="page-shell"><PublicHeader locale={locale} theme={theme} /><section className="jobs-hero"><div className="container"><p className="eyebrow">Company profiles</p><h1>Meet teams building across the Gulf.</h1></div></section><section className="section"><div className="container company-grid">{companies.map((company) => <article key={company.slug} className="company-card"><div className="company-mark detail-mark" style={{ backgroundColor: company.accent }}>{company.initials}</div><div><p className="eyebrow"><Building2 size={15} />{company.industry}</p><h2>{company.name}</h2><p>{company.summary}</p><span><MapPin size={16} />{company.location}</span></div><Link className="round-link" href={`/companies/${company.slug}` as Route} aria-label={`View ${company.name}`}><ArrowUpRight size={18} /></Link></article>)}</div></section></main>;
}

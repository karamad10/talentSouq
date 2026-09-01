import type { Metadata } from "next";
import { ArrowLeft, Bookmark, BriefcaseBusiness, Clock3, MapPin, Share2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { getJob, jobs } from "@/data/jobs";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() { return jobs.map((job) => ({ id: job.id })); }

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
  return <main className="page-shell"><PublicHeader locale={locale} theme={theme} user={user} /><div className="container detail-wrap"><Link className="back-link" href="/jobs"><ArrowLeft size={17} />Back to jobs</Link><div className="job-detail-grid"><article className="job-detail"><header><div className="company-mark detail-mark" style={{ backgroundColor: job.accent }}>{job.initials}</div><div><p className="job-company">{job.company}</p><h1>{job.title}</h1><div className="detail-meta"><span><MapPin size={16} />{job.location}</span><span><BriefcaseBusiness size={16} />{job.type} · {job.mode}</span><span><Clock3 size={16} />Posted {job.posted}</span></div></div></header><hr /><h2>About the role</h2><p>{job.summary} You’ll work with a thoughtful cross-functional team, turn insight into practical outcomes, and help raise the quality bar as the company grows.</p><h2>What you’ll bring</h2><ul><li>Strong craft and clear communication in your discipline.</li><li>Experience collaborating across functions and navigating ambiguity.</li><li>A practical, curious approach with care for customers and colleagues.</li></ul><h2>What’s on offer</h2><p>A competitive package, meaningful ownership, flexible working, and the chance to help shape a growing regional business.</p></article><aside className="apply-card"><span className="tag">Actively hiring</span><h2>Interested in this role?</h2><p>Create your TalentSouq profile once and apply with confidence.</p><Link className="button button-primary button-full" href="/auth/login?mode=signup">Apply now</Link><button className="button button-secondary button-full" type="button"><Bookmark size={17} />Save job</button><button className="share-link" type="button"><Share2 size={17} />Share this role</button></aside></div></div></main>;
}

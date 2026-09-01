import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, ExternalLink, PartyPopper } from "lucide-react";
import Link from "next/link";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Applications", description: "Track Easy Apply and external applications." };

const applicationViewIcons = [BriefcaseBusiness, ExternalLink, CalendarDays, PartyPopper];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "all" } = await searchParams;
  return <><WorkspaceHeader eyebrow="Tracking" title="Applications" description="Track Easy Apply, external applications, employer activity, and next steps." />
    <div className="section-tabs">{["all", "easy", "external", "interviews"].map((tab) => <Link key={tab} href={`/seeker/applications?view=${tab}`} aria-current={view === tab ? "page" : undefined}>{tab === "easy" ? "Easy Apply" : tab[0].toUpperCase() + tab.slice(1)}</Link>)}</div>
    <section className="metric-grid metric-grid-four">{seekerSummary.applicationViews.map((item, index) => <StatCard key={item.label} icon={applicationViewIcons[index]} value={item.count} label={item.label} />)}</section>
    <SectionCard title="Application tracker" description="Select an application to open messages, the posting, or withdrawal controls.">
      <div className="data-table application-table" role="table"><div role="row"><strong>Role</strong><strong>Company</strong><strong>Stage</strong><strong>Match</strong><strong>Next step</strong><strong>Updated</strong></div>{seekerSummary.applications.map((item) => <Link href="/seeker/applications" role="row" key={item.role}><span>{item.role}</span><span>{item.company}</span><span><mark>{item.stage}</mark></span><span className="match-cell">{item.score}%</span><span>{item.nextStep}</span><span>{item.updated} <ArrowUpRight size={13} /></span></Link>)}</div>
    </SectionCard></>;
}

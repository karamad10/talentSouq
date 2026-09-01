import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MessageSquare, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Seeker home", description: "Your job search overview and next actions." };

export default function SeekerDashboardPage() {
  return <>
    <WorkspaceHeader eyebrow="Personal workspace" title="Good morning, Sarah." description="Here is what changed in your search and what needs your attention today." action={{ href: "/seeker/jobs", label: "Find jobs" }} />
    <section className="metric-grid metric-grid-four" aria-label="Job search overview">
      <StatCard icon={BriefcaseBusiness} value={seekerSummary.applications.length} label="Active applications" detail="2 changed this week" />
      <StatCard icon={CalendarDays} value={seekerSummary.interviews} label="Upcoming interviews" detail="Next one tomorrow" />
      <StatCard icon={MessageSquare} value={seekerSummary.unreadMessages} label="Unread messages" detail="1 needs a reply" />
      <StatCard icon={TrendingUp} value={seekerSummary.weeklyViews} label="Profile views" detail="Up 12% this week" />
    </section>
    <div className="workspace-content-grid">
      <SectionCard title="Next actions" description="The most useful things to do now." action={<Link className="arrow-link" href="/seeker/applications">All applications <ArrowUpRight size={15} /></Link>}>
        <div className="action-list">{seekerSummary.priorities.map((item) => <Link href={item.title.includes("portfolio") ? "/seeker/profile" : "/seeker/applications"} key={item.title}><span className="status-dot" data-tone={item.level.toLowerCase()} /><div><strong>{item.title}</strong><p>{item.detail}</p></div><small>{item.due}</small><ArrowUpRight size={16} /></Link>)}</div>
      </SectionCard>
      <SectionCard title="Profile health" description="Your person profile is visible to employers." action={<Link className="arrow-link" href="/seeker/profile">Edit profile <ArrowUpRight size={15} /></Link>}>
        <div className="profile-score-row"><div><Target size={20} /><strong>{seekerSummary.profile.completeness}%</strong><span>complete</span></div><div className="readiness-list">{seekerSummary.readiness.slice(0, 3).map((item) => <div className="readiness-row" key={item.label}><div><span>{item.label}</span><strong>{item.value}%</strong></div><i><span style={{ width: `${item.value}%` }} /></i></div>)}</div></div>
      </SectionCard>
    </div>
    <SectionCard title="Recommended for you" description="Roles selected from your preferences and profile." action={<Link className="arrow-link" href="/seeker/jobs">Browse all <ArrowUpRight size={15} /></Link>}>
      <div className="job-grid">{seekerSummary.recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
    </SectionCard>
    <div className="workspace-content-grid compact-grid">
      <SectionCard title="Application snapshot" action={<Link className="arrow-link" href="/seeker/applications">Open tracker <ArrowUpRight size={15} /></Link>}>
        <div className="funnel-row">{seekerSummary.timeline.map((stage) => <div key={stage.label}><strong>{stage.count}</strong><span>{stage.label}</span></div>)}</div>
      </SectionCard>
      <SectionCard title="AI companion" action={<Link className="arrow-link" href="/seeker/companion">Open <ArrowUpRight size={15} /></Link>}>
        <div className="dashboard-callout"><Sparkles size={20} /><div><strong>Weekly match digest is ready</strong><p>{seekerSummary.companion.summary}</p></div></div>
      </SectionCard>
    </div>
  </>;
}

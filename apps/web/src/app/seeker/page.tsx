import type { Metadata } from "next";
import { ArrowUpRight, Bookmark, BriefcaseBusiness, CalendarDays, FileText, MessageSquare, Search, Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import Link from "next/link";
import { DashboardLead, DashboardLinkGrid, DashboardMetricLinks } from "@/components/dashboard-primitives";
import { JobCard } from "@/components/job-card";
import { SectionCard } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Seeker home", description: "Your job search overview and next actions." };

export default function SeekerDashboardPage() {
  return <>
    <DashboardLead eyebrow="Personal workspace" title="Good morning, Sarah." description="Two things need your attention, and fresh roles are ready to review." action={{ href: "/seeker/jobs", label: "Discover jobs" }}>
      <p className="dashboard-priority-label">Priority today</p><strong>Choose your interview time</strong><p>Nexa Commerce is waiting for availability for the Senior Product Designer role.</p><Link href="/seeker/offers">Review invitation <ArrowUpRight size={16} /></Link>
    </DashboardLead>
    <DashboardMetricLinks items={[
      { href: "/seeker/applications", icon: BriefcaseBusiness, value: seekerSummary.applications.length, title: "Active applications", description: "2 moved this week", tone: "attention" },
      { href: "/seeker/offers", icon: CalendarDays, value: seekerSummary.interviews, title: "Interviews & offers", description: "Next one tomorrow" },
      { href: "/seeker/messages", icon: MessageSquare, value: seekerSummary.unreadMessages, title: "Unread messages", description: "1 needs a reply" },
      { href: "/seeker/profile", icon: TrendingUp, value: `${seekerSummary.weeklyViews}`, title: "Profile views", description: "Up 12% this week" }
    ]} />
    <div className="dashboard-main-grid">
      <SectionCard title="Your next moves" description="The actions most likely to advance your search." action={<Link className="arrow-link" href="/seeker/applications">Open application tracker <ArrowUpRight size={15} /></Link>}>
        <div className="action-list">{seekerSummary.priorities.map((item) => <Link href={item.title.includes("portfolio") ? "/seeker/profile" : "/seeker/applications"} key={item.title}><span className="status-dot" data-tone={item.level.toLowerCase()} /><div><strong>{item.title}</strong><p>{item.detail}</p></div><small>{item.due}</small><ArrowUpRight size={16} /></Link>)}</div>
      </SectionCard>
      <SectionCard title="Profile readiness" description="Improve the signals employers see." action={<Link className="arrow-link" href="/seeker/profile">Edit profile <ArrowUpRight size={15} /></Link>}>
        <div className="profile-score-row"><div><Target size={20} /><strong>{seekerSummary.profile.completeness}%</strong><span>complete</span></div><div className="readiness-list">{seekerSummary.readiness.slice(0, 3).map((item) => <div className="readiness-row" key={item.label}><div><span>{item.label}</span><strong>{item.value}%</strong></div><i><span style={{ width: `${item.value}%` }} /></i></div>)}</div></div>
      </SectionCard>
    </div>
    <SectionCard title="Recommended roles" description="Selected from your profile, companion preferences, and saved searches." action={<Link className="arrow-link" href="/seeker/jobs">See all matches <ArrowUpRight size={15} /></Link>}>
      <div className="job-grid">{seekerSummary.recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
    </SectionCard>
    <div className="dashboard-main-grid dashboard-main-grid-equal">
      <SectionCard title="Application snapshot" action={<Link className="arrow-link" href="/seeker/applications">Open tracker <ArrowUpRight size={15} /></Link>}>
        <div className="funnel-row">{seekerSummary.timeline.map((stage) => <div key={stage.label}><strong>{stage.count}</strong><span>{stage.label}</span></div>)}</div>
      </SectionCard>
      <SectionCard title="AI companion" action={<Link className="arrow-link" href="/seeker/companion">Open <ArrowUpRight size={15} /></Link>}>
        <div className="dashboard-callout"><Sparkles size={20} /><div><strong>Weekly match digest is ready</strong><p>{seekerSummary.companion.summary}</p></div></div>
      </SectionCard>
    </div>
    <DashboardLinkGrid title="Explore your career workspace" description="Every part of your personal job search, organized around the next useful task." items={[
      { href: "/seeker/jobs", icon: Search, title: "Discover jobs", description: "Search roles, apply filters, and save searches.", meta: `${seekerSummary.savedJobs} saved roles` },
      { href: "/seeker/applications", icon: BriefcaseBusiness, title: "Applications", description: "Track submitted, reviewed, and external applications.", meta: `${seekerSummary.applications.length} active` },
      { href: "/seeker/offers", icon: CalendarDays, title: "Offers & interviews", description: "Choose slots, prepare, and respond before deadlines.", meta: `${seekerSummary.pendingInvites} invitations`, tone: "attention" },
      { href: "/seeker/saved", icon: Bookmark, title: "Saved & alerts", description: "Revisit roles and manage fresh-match alerts.", meta: "3 saved searches" },
      { href: "/seeker/messages", icon: MessageSquare, title: "Messages", description: "Talk with recruiters and review notifications.", meta: `${seekerSummary.unreadMessages} unread` },
      { href: "/seeker/companion", icon: Sparkles, title: "AI companion", description: "Tune your search brief and weekly match digest.", meta: "Weekly matches on" },
      { href: "/seeker/profile", icon: UserRound, title: "My profile", description: "Manage your CV, visibility, skills, and experience.", meta: `${seekerSummary.profile.completeness}% complete` },
      { href: "/seeker/profile", icon: FileText, title: "CV & portfolio", description: "Keep the work that supports your applications current.", meta: seekerSummary.profile.cvStatus }
    ]} />
  </>;
}

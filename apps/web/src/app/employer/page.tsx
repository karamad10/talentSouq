import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, ClipboardCheck, CreditCard, FolderKanban, MessageSquare, Search, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { DashboardLead, DashboardLinkGrid, DashboardMetricLinks } from "@/components/dashboard-primitives";
import { SectionCard } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Employer home", description: "Hiring operations overview for your company." };

export default function EmployerDashboardPage() {
  return <>
    <DashboardLead eyebrow="Company workspace" title="Hiring overview" description={`${employerSummary.newApplicants} new applicants arrived this week, with interviews and reviews ready to move.`} action={{ href: "/employer/jobs", label: "Manage jobs" }}>
      <p className="dashboard-priority-label">Next hiring decision</p><strong>Review 7 new applicants</strong><p>Senior Product Designer has the highest concentration of fresh, qualified candidates.</p><Link href="/employer/pipeline">Open ATS pipeline <ArrowUpRight size={16} /></Link>
    </DashboardLead>
    <DashboardMetricLinks items={[
      { href: "/employer/jobs", icon: BriefcaseBusiness, value: employerSummary.openRoles, title: "Open roles", description: "3 accepting applications" },
      { href: "/employer/pipeline", icon: UsersRound, value: employerSummary.newApplicants, title: "New applicants", description: "Since Monday", tone: "attention" },
      { href: "/employer/interviews", icon: CalendarDays, value: employerSummary.interviews, title: "Interviews", description: "4 scheduled this week" },
      { href: "/employer/messages", icon: MessageSquare, value: 5, title: "Unread messages", description: "2 candidate replies" }
    ]} />
    <div className="dashboard-main-grid">
      <SectionCard title="Hiring pipeline" description="Candidates who need attention." action={<Link className="arrow-link" href="/employer/pipeline">Open ATS <ArrowUpRight size={15} /></Link>}>
        <div className="candidate-list">{employerSummary.pipeline.slice(0, 4).map((candidate) => <Link href="/employer/pipeline" key={candidate.name}><span className="candidate-avatar">{candidate.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{candidate.name}</strong><p>{candidate.role} · {candidate.stage}</p></div><b>{candidate.score}%</b><ArrowUpRight size={15} /></Link>)}</div>
      </SectionCard>
      <SectionCard title="Today" description="Your hiring team’s next actions.">
        <div className="action-list small">{employerSummary.tasks.map((task) => <Link href={task.href} key={task.title}><ClipboardCheck size={17} /><div><strong>{task.title}</strong><p>{task.detail}</p></div><small>{task.when}</small></Link>)}</div>
      </SectionCard>
    </div>
    <SectionCard title="Active jobs" description="Performance across current listings." action={<Link className="arrow-link" href="/employer/jobs">Manage jobs <ArrowUpRight size={15} /></Link>}>
      <div className="data-table" role="table" aria-label="Active jobs"><div role="row"><strong>Role</strong><strong>Status</strong><strong>Applicants</strong><strong>Updated</strong></div>{employerSummary.vacancies.map((job) => <div role="row" key={job.title}><span>{job.title}</span><span><mark>{job.status}</mark></span><span>{job.applicants}</span><span>{job.updated}</span></div>)}</div>
    </SectionCard>
    <DashboardLinkGrid title="Run your hiring workspace" description="Move from job creation to a confident hiring decision without losing context." items={[
      { href: "/employer/jobs", icon: BriefcaseBusiness, title: "Jobs", description: "Create, publish, pause, and assess listing performance.", meta: `${employerSummary.openRoles} open roles` },
      { href: "/employer/candidates", icon: Search, title: "Find candidates", description: "Search talent, apply filters, invite, and save to folders.", meta: "Full talent search" },
      { href: "/employer/pipeline", icon: FolderKanban, title: "ATS pipeline", description: "Review applicants, move stages, and retain hiring context.", meta: `${employerSummary.newApplicants} new applicants`, tone: "attention" },
      { href: "/employer/interviews", icon: CalendarDays, title: "Interviews", description: "Schedule sessions, manage panels, and capture feedback.", meta: `${employerSummary.interviews} scheduled` },
      { href: "/employer/assessments", icon: ClipboardCheck, title: "Assessments", description: "Send role-relevant evaluations and track completion.", meta: "2 active templates" },
      { href: "/employer/messages", icon: MessageSquare, title: "Messages", description: "Stay on top of candidate and team communication.", meta: "5 unread" },
      { href: "/employer/company", icon: Building2, title: "Company profile", description: "Maintain the public company story, brand, and contact details.", meta: `${employerSummary.company.completeness}% complete` },
      { href: "/employer/team", icon: UserPlus, title: "Team & permissions", description: "Invite colleagues and set organization-scoped access.", meta: employerSummary.plan.seats },
      { href: "/employer/billing", icon: CreditCard, title: "Plan & credits", description: "Review seats, credits, invoices, and included tools.", meta: `${employerSummary.plan.credits} credits available` }
    ]} />
  </>;
}

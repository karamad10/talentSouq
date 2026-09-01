import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, ClipboardCheck, MessageSquare, UsersRound } from "lucide-react";
import Link from "next/link";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Employer home", description: "Hiring operations overview for your company." };

export default function EmployerDashboardPage() {
  return <>
    <WorkspaceHeader eyebrow="Company workspace" title="Hiring overview" description={`A focused view of ${employerSummary.organization}'s active hiring work.`} action={{ href: "/employer/jobs", label: "Post a job" }} />
    <section className="metric-grid metric-grid-four" aria-label="Hiring overview">
      <StatCard icon={BriefcaseBusiness} value={employerSummary.openRoles} label="Open roles" detail="3 accepting applications" />
      <StatCard icon={UsersRound} value={employerSummary.newApplicants} label="New applicants" detail="Since Monday" />
      <StatCard icon={CalendarDays} value={employerSummary.interviews} label="Interviews" detail="4 this week" />
      <StatCard icon={MessageSquare} value={5} label="Unread messages" detail="2 candidate replies" />
    </section>
    <div className="workspace-content-grid">
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
  </>;
}

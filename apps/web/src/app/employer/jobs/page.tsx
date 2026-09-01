import type { Metadata } from "next";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import Link from "next/link";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Employer jobs" };

const statusTabs = ["All", "Active", "Drafts", "Closed"] as const;

export default async function EmployerJobsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "All", q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const jobs = employerSummary.vacancies
    .filter((job) => status === "All" || job.status === status.replace(/s$/, ""))
    .filter((job) => !query || job.title.toLowerCase().includes(query));

  return <><WorkspaceHeader eyebrow="Listings" title="Jobs" description="Create, publish, feature, pause, and measure every vacancy." actionSlot={<PreviewActionButton type="button" className={buttonVariants({ tone: "primary", size: "sm" })} storageKey="employer-jobs-post" pendingLabel="Creating…" successLabel="Draft created">Post a job</PreviewActionButton>} />
  <section className="metric-grid metric-grid-three"><StatCard icon={BriefcaseBusiness} value="3" label="Active" /><StatCard icon={Plus} value="1" label="Draft" /><StatCard icon={Search} value="42" label="Total applicants" /></section>
  <div className="workspace-toolbar"><div className="section-tabs">{statusTabs.map((tab) => <Link key={tab} href={`/employer/jobs?status=${tab}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={status === tab ? "page" : undefined}>{tab}</Link>)}</div><form className="toolbar-search" action="/employer/jobs"><input type="hidden" name="status" value={status} /><Search size={16} /><input name="q" defaultValue={q} placeholder="Search jobs" /></form></div>
  <SectionCard title="All listings" description="The mobile listing actions are available per row: edit, applicants, publish, pause, and close."><div className="data-table jobs-table" role="table"><div role="row"><strong>Role</strong><strong>Status</strong><strong>Applicants</strong><strong>Updated</strong><strong>Actions</strong></div>{jobs.length ? jobs.map((job) => <div role="row" key={job.title}><span><b>{job.title}</b><small>Full-time · Hybrid · Dubai</small></span><span><mark>{job.status}</mark></span><span>{job.applicants}</span><span>{job.updated}</span><span className="row-actions"><PreviewActionButton type="button" storageKey={`employer-job-edit-${job.title}`} successLabel="Saved">Edit</PreviewActionButton><PreviewActionButton type="button" storageKey={`employer-job-applicants-${job.title}`} successLabel="Opened">Applicants</PreviewActionButton></span></div>) : <div role="row"><span>No listings match this filter.</span></div>}</div></SectionCard></>;
}

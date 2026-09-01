import type { Metadata } from "next";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Employer jobs" };
export default function EmployerJobsPage() { return <><WorkspaceHeader eyebrow="Listings" title="Jobs" description="Create, publish, feature, pause, and measure every vacancy." action={{ href: "/employer/jobs", label: "Post a job" }} />
  <section className="metric-grid metric-grid-three"><StatCard icon={BriefcaseBusiness} value="3" label="Active" /><StatCard icon={Plus} value="1" label="Draft" /><StatCard icon={Search} value="42" label="Total applicants" /></section>
  <div className="workspace-toolbar"><div className="section-tabs"><button aria-current="page">All</button><button>Active</button><button>Drafts</button><button>Closed</button></div><label className="toolbar-search"><Search size={16} /><input placeholder="Search jobs" /></label></div>
  <SectionCard title="All listings" description="The mobile listing actions are available per row: edit, applicants, publish, pause, and close."><div className="data-table jobs-table" role="table"><div role="row"><strong>Role</strong><strong>Status</strong><strong>Applicants</strong><strong>Updated</strong><strong>Actions</strong></div>{employerSummary.vacancies.map((job) => <div role="row" key={job.title}><span><b>{job.title}</b><small>Full-time · Hybrid · Dubai</small></span><span><mark>{job.status}</mark></span><span>{job.applicants}</span><span>{job.updated}</span><span className="row-actions"><button>Edit</button><button>Applicants</button></span></div>)}</div></SectionCard></>; }

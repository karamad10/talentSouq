import type { Metadata } from "next";
import { Bell, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Discover jobs", description: "Search and filter jobs." };

export default async function SeekerJobsPage({ searchParams }: { searchParams: Promise<{ q?: string; location?: string; view?: string }> }) {
  const query = await searchParams;
  const saved = query.view === "saved";
  return <>
    <WorkspaceHeader eyebrow="Discover" title="Find your next role" description="Search active jobs, refine every preference, and save searches for alerts." />
    <div className="section-tabs"><Link href="/seeker/jobs" aria-current={!saved ? "page" : undefined}>Browse</Link><Link href="/seeker/jobs?view=saved" aria-current={saved ? "page" : undefined}>Saved jobs ({seekerSummary.savedJobs})</Link></div>
    <form className="workspace-search" action="/seeker/jobs"><label><Search size={18} /><input name="q" defaultValue={query.q} placeholder="Job title, company, or skill" /></label><label><input name="location" defaultValue={query.location} placeholder="City, country, or remote" /></label><button className="button button-primary button-small" type="submit">Search</button></form>
    <SectionCard title="Filters" description="The full mobile filter set, arranged for desktop." action={<button className="text-button" type="reset">Clear all</button>}>
      <div className="filter-workbench compact-filters"><FilterGroup title="Category" values={seekerSummary.filters.categories} /><FilterGroup title="Employment" values={seekerSummary.filters.employmentTypes} /><FilterGroup title="Work mode" values={seekerSummary.filters.workModes} /><FilterGroup title="Experience" values={seekerSummary.filters.experience} /><FilterGroup title="Education" values={seekerSummary.filters.education} /><FilterGroup title="Salary" values={seekerSummary.filters.salary} /><FilterGroup title="Country" values={seekerSummary.filters.countries} /><FilterGroup title="Posted" values={seekerSummary.filters.postedWithin} /></div>
      <div className="filter-footer"><span><SlidersHorizontal size={16} /> Also supports nationality, designation, gender preference, and salary currency.</span><button className="filter-button" type="button"><Bell size={16} /> Save search</button></div>
    </SectionCard>
    <SectionCard title={saved ? "Saved jobs" : query.q ? `Results for “${query.q}”` : "Recommended jobs"} description={saved ? "Jobs you bookmarked from search and recommendations." : "Ordered by fit, freshness, and your preferences."} action={<span className="status-pill">{saved ? seekerSummary.savedJobs : 24} roles</span>}>
      <div className="job-grid">{seekerSummary.recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
    </SectionCard>
  </>;
}

function FilterGroup({ title, values }: { title: string; values: string[] }) { return <fieldset className="filter-group"><legend>{title}</legend><div>{values.map((value) => <label key={value}><input type="checkbox" name={title} value={value} /> <span>{value}</span></label>)}</div></fieldset>; }

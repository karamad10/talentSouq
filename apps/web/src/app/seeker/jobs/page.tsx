import type { Metadata } from "next";
import { Bell, Search, SlidersHorizontal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { JobCard } from "@/components/job-card";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { jobs } from "@/data/jobs";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Discover jobs", description: "Search and filter jobs." };

type JobsSearchParams = { q?: string; location?: string; view?: string; Category?: string | string[]; "Work mode"?: string | string[]; Employment?: string | string[] };

function toArray(value: string | string[] | undefined) {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export default async function SeekerJobsPage({ searchParams }: { searchParams: Promise<JobsSearchParams> }) {
  const query = await searchParams;
  const saved = query.view === "saved";
  const q = (query.q ?? "").trim().toLowerCase();
  const location = (query.location ?? "").trim().toLowerCase();
  const categories = toArray(query.Category);
  const modes = toArray(query["Work mode"]);
  const types = toArray(query.Employment);

  const results = jobs
    .filter((job) => !q || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(q))
    .filter((job) => !location || job.location.toLowerCase().includes(location))
    .filter((job) => categories.length === 0 || categories.includes(job.category))
    .filter((job) => modes.length === 0 || modes.includes(job.mode))
    .filter((job) => types.length === 0 || types.includes(job.type));
  const visible = saved ? seekerSummary.recommendedJobs : results;

  return (
    <>
      <WorkspaceHeader eyebrow="Discover" title="Find your next role" description="Search active jobs, refine every preference, and save searches for alerts." />
      <Tabs
        className="mb-3"
        ariaLabel="Job list view"
        items={[
          { label: "Browse", href: "/seeker/jobs" as Route, current: !saved },
          { label: "Saved jobs", href: "/seeker/jobs?view=saved" as Route, count: seekerSummary.savedJobs, current: saved }
        ]}
      />
      <SectionPanel title="Search & filters" description="Filters submit with the search, so results are always shareable by URL.">
        <form action="/seeker/jobs" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="seeker-jobs-q">
              Job title, company, or skill
            </label>
            <div className="flex h-9 min-w-64 flex-1 items-center gap-2 rounded-ts-md border border-ts-field bg-ts-surface px-3 transition-colors focus-within:border-ts-primary">
              <Search size={15} aria-hidden="true" className="shrink-0 text-ts-muted" />
              <input
                id="seeker-jobs-q"
                name="q"
                type="search"
                defaultValue={query.q}
                placeholder="Job title, company, or skill"
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
              />
            </div>
            <label className="sr-only" htmlFor="seeker-jobs-location">
              City, country, or remote
            </label>
            <input
              id="seeker-jobs-location"
              name="location"
              defaultValue={query.location}
              placeholder="City, country, or remote"
              className="h-9 w-48 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-[13px] text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
            />
            <button className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-9 rounded-ts-md px-4 text-[13px]")} type="submit">
              Search
            </button>
            <Link href="/seeker/jobs" className="text-[13px] font-semibold text-ts-muted transition-colors hover:text-ts-ink">
              Clear all
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 border-t border-ts-line pt-3 max-[981px]:grid-cols-2 max-[680px]:grid-cols-1">
            <FilterGroup title="Category" values={seekerSummary.filters.categories} selected={categories} />
            <FilterGroup title="Work mode" values={seekerSummary.filters.workModes} selected={modes} />
            <FilterGroup title="Employment" values={seekerSummary.filters.employmentTypes} selected={types} />
            <FilterGroup title="Posted" values={seekerSummary.filters.postedWithin} selected={[]} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ts-line pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-ts-muted">
              <SlidersHorizontal size={13} aria-hidden="true" /> Also supports salary, experience, education, nationality, and country filters.
            </span>
            <PreviewActionButton
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
              storageKey="seeker-jobs-save-search"
              successLabel="Search saved"
            >
              <Bell size={14} aria-hidden="true" /> Save search
            </PreviewActionButton>
          </div>
        </form>
      </SectionPanel>
      <SectionPanel
        className="mt-4"
        title={saved ? "Saved jobs" : q ? `Results for “${query.q}”` : "Recommended jobs"}
        description={saved ? "Jobs you bookmarked from search and recommendations." : "Ordered by fit, freshness, and your preferences."}
        action={<Badge tone="neutral" size="sm">{visible.length} roles</Badge>}
      >
        {visible.length === 0 ? (
          <EmptyState icon={Search} title="No roles match this search" description="Try fewer filters or a broader keyword." action={{ href: "/seeker/jobs", label: "Clear filters" }} />
        ) : (
          <div className="job-grid">
            {visible.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </SectionPanel>
    </>
  );
}

function FilterGroup({ title, values, selected }: { title: string; values: string[]; selected: string[] }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-1.5 p-0 text-xs font-semibold text-ts-muted">{title}</legend>
      <div className="flex flex-col gap-1">
        {values.map((value) => (
          <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-ts-ink">
            <input
              type="checkbox"
              name={title}
              value={value}
              defaultChecked={selected.includes(value)}
              className="size-4 accent-ts-primary"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

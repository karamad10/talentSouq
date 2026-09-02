import type { Metadata } from "next";
import { CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { AutoSubmitSelect } from "@/components/dashboard/auto-submit-select";
import { FilterGroup, toArray, toScalar } from "@/components/dashboard/filter-group";
import { ResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary, seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer jobs" };

const statusTabs = ["All", "Active", "Drafts", "Closed"] as const;

type JobsSearchParams = {
  status?: string | string[];
  q?: string | string[];
  sort?: string | string[];
  created?: string | string[];
  Category?: string | string[];
  Employment?: string | string[];
  "Work mode"?: string | string[];
};

export default async function EmployerJobsPage({ searchParams }: { searchParams: Promise<JobsSearchParams> }) {
  const params = await searchParams;
  const status = toScalar(params.status, "All");
  const q = toScalar(params.q, "");
  const sort = toScalar(params.sort, "newest");
  const created = toScalar(params.created, "");
  const categories = toArray(params.Category);
  const types = toArray(params.Employment);
  const modes = toArray(params["Work mode"]);
  const query = q.trim().toLowerCase();

  const rows = employerSummary.responses
    .filter((row) => status === "All" || (status === "Closed" ? false : row.status === status.replace(/s$/, "")))
    .filter((row) => !query || row.job.toLowerCase().includes(query))
    .filter((row) => categories.length === 0 || categories.includes(row.category))
    .filter((row) => types.length === 0 || types.includes(row.type))
    .filter((row) => modes.length === 0 || modes.includes(row.mode))
    .sort((a, b) => (sort === "title" ? a.job.localeCompare(b.job) : sort === "responses" ? b.total - a.total : 0));

  const keepFilters = (tab: string) => {
    const search = new URLSearchParams();
    if (tab !== "All") search.set("status", tab);
    if (q) search.set("q", q);
    if (sort !== "newest") search.set("sort", sort);
    for (const value of categories) search.append("Category", value);
    for (const value of types) search.append("Employment", value);
    for (const value of modes) search.append("Work mode", value);
    const qs = search.toString();
    return (qs ? `/employer/jobs?${qs}` : "/employer/jobs") as Route;
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="Listings"
        title="Jobs"
        description="Create, publish, feature, pause, and measure every vacancy."
        action={{ href: "/employer/jobs/new" as Route, label: "Post a job" }}
      />
      {created ? (
        <p className="mb-4 flex items-center gap-2 rounded-ts-md border border-ts-line bg-ts-success-tint px-4 py-3 text-[13px] font-semibold text-ts-success" role="status">
          <CheckCircle2 size={15} aria-hidden="true" />
          Draft created: “{created}”. It appears under Drafts once the backend is connected — this preview does not persist it.
        </p>
      ) : null}
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Active", value: 2 },
          { label: "Draft", value: 1 },
          { label: "Expiring in 7 days", value: 1, detail: "Frontend Engineer", tone: "attention" },
          { label: "Total applicants", value: 42 }
        ]}
      />
      <SectionPanel
        title="Search & filters"
        description="Filters submit with the search, so any view is shareable by URL."
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-ts-muted">
            <SlidersHorizontal size={13} aria-hidden="true" /> Same filter set as job discovery
          </span>
        }
      >
        <form action="/employer/jobs" className="flex flex-col gap-3">
          {status !== "All" ? <input type="hidden" name="status" value={status} /> : null}
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="jobs-search">
              Search jobs by title
            </label>
            <div className="flex h-9 min-w-56 flex-1 items-center gap-2 rounded-ts-md border border-ts-field bg-ts-surface px-3 transition-colors focus-within:border-ts-primary">
              <Search size={15} aria-hidden="true" className="shrink-0 text-ts-muted" />
              <input
                id="jobs-search"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search jobs by title"
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
              />
            </div>
            <label className="sr-only" htmlFor="jobs-sort">
              Sort jobs
            </label>
            <AutoSubmitSelect id="jobs-sort" name="sort" defaultValue={sort}>
              <option value="newest">Sort: Newest first</option>
              <option value="title">Sort: Title A–Z</option>
              <option value="responses">Sort: Most responses</option>
            </AutoSubmitSelect>
            <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-9 rounded-ts-md px-4 text-[13px]")}>
              Apply
            </button>
            <Link href="/employer/jobs" className="text-[13px] font-semibold text-ts-muted transition-colors hover:text-ts-ink">
              Clear all
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 border-t border-ts-line pt-3 max-[981px]:grid-cols-2 max-[680px]:grid-cols-1">
            <FilterGroup title="Category" values={seekerSummary.filters.categories} selected={categories} />
            <FilterGroup title="Employment" values={seekerSummary.filters.employmentTypes} selected={types} />
            <FilterGroup title="Work mode" values={seekerSummary.filters.workModes} selected={modes} />
            <FilterGroup title="Posted" values={seekerSummary.filters.postedWithin} selected={[]} />
          </div>
        </form>
      </SectionPanel>
      <SectionPanel
        className="mt-4"
        title="All listings"
        description="Response volume, review progress, and per-row actions for every listing."
        action={<Tabs ariaLabel="Filter jobs by status" items={statusTabs.map((tab) => ({ label: tab, href: keepFilters(tab), current: status === tab }))} />}
      >
        <ResponsesTable rows={rows} />
      </SectionPanel>
    </>
  );
}

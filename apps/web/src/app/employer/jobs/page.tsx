import type { Metadata } from "next";
import { BriefcaseBusiness, CheckCircle2, ChevronDown, Clock3, FileEdit, Search, SlidersHorizontal, UsersRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { AutoSubmitSelect } from "@/components/dashboard/auto-submit-select";
import { FilterDisclosure, FilterGroup, toArray, toScalar } from "@/components/dashboard/filter-group";
import { ResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary, workspaceFilters } from "@/data/workspace";
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
  Country?: string | string[];
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
  const activeFilterCount = categories.length + types.length + modes.length;

  const rows = employerSummary.responses
    .filter((row) => status === "All" || (status === "Closed" ? false : row.status === status.replace(/s$/, "")))
    .filter((row) => !query || row.job.toLowerCase().includes(query))
    .filter((row) => categories.length === 0 || categories.includes(row.category))
    .filter((row) => types.length === 0 || types.includes(row.type))
    .filter((row) => modes.length === 0 || modes.includes(row.mode))
    .sort((a, b) => (sort === "title" ? a.job.localeCompare(b.job) : sort === "responses" ? b.total - a.total : 0));

  const totalApplicants = employerSummary.responses.reduce((sum, row) => sum + row.total, 0);
  const unreviewed = employerSummary.responses.reduce((sum, row) => sum + row.fresh, 0);

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
        <p className="mb-6 flex items-center gap-2.5 rounded-ts-md border border-ts-line bg-ts-success-tint px-5 py-4 text-sm font-semibold text-ts-success" role="status">
          <CheckCircle2 size={17} aria-hidden="true" />
          Draft created: “{created}”. It appears under Drafts once the backend is connected — this preview does not persist it.
        </p>
      ) : null}

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Active listings", value: 2, detail: "collecting responses", icon: BriefcaseBusiness },
          { label: "Drafts", value: 1, detail: "not published yet", icon: FileEdit },
          { label: "Expiring in 7 days", value: 1, detail: "Frontend Engineer", tone: "attention", icon: Clock3 },
          { label: "Total applicants", value: totalApplicants, detail: `${unreviewed} still unreviewed`, icon: UsersRound, href: "/employer/pipeline" }
        ]}
      />

      {/* Search + folded filters, matching the seeker discovery pattern. */}
      <form action="/employer/jobs" className="flex flex-col gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-6 max-[680px]:p-4">
        {status !== "All" ? <input type="hidden" name="status" value={status} /> : null}
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="jobs-search">
            Search jobs by title
          </label>
          <div className="flex h-12 min-w-64 flex-1 items-center gap-2.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15">
            <Search size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="jobs-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search jobs by title"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
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
          <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-6 text-sm")}>
            Apply
          </button>
        </div>

        <FilterDisclosure
          open={activeFilterCount > 0}
          summary={
            <>
              <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
                <SlidersHorizontal size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ts-ink">All filters</span>
                <span className="block text-[13px] font-medium text-ts-muted">
                  {activeFilterCount > 0 ? `${activeFilterCount} active · tap to adjust` : "Category, employment type, work mode and country"}
                </span>
              </span>
              {activeFilterCount > 0 ? (
                <span className="inline-flex h-7 items-center rounded-full bg-ts-primary px-3 text-[13px] font-bold text-white">{activeFilterCount}</span>
              ) : null}
              <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-ts-muted transition-transform group-open/filters:rotate-180" />
            </>
          }
        >
          <div className="grid gap-x-8 gap-y-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-4">
            <FilterGroup title="Category" values={workspaceFilters.categories} selected={categories} />
            <FilterGroup title="Employment" values={workspaceFilters.employmentTypes} selected={types} />
            <FilterGroup title="Work mode" values={workspaceFilters.workModes} selected={modes} />
            <FilterGroup title="Country" values={workspaceFilters.countries} selected={toArray(params.Country)} name="Country" />
          </div>
        </FilterDisclosure>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13px] text-ts-muted">
            {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied` : "No filters applied yet"} · {rows.length} of{" "}
            {employerSummary.responses.length} listings
          </span>
          {activeFilterCount > 0 || query ? (
            <Link
              href="/employer/jobs"
              className="inline-flex h-10 items-center gap-1.5 rounded-ts-md px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
            >
              <X size={14} aria-hidden="true" /> Clear all
            </Link>
          ) : null}
        </div>
      </form>

      <SectionPanel
        className="mt-6"
        title="All listings"
        description="Response volume, review progress, and per-row actions for every listing."
        bodyClassName="flex flex-col gap-4"
        action={<Tabs ariaLabel="Filter jobs by status" items={statusTabs.map((tab) => ({ label: tab, href: keepFilters(tab), current: status === tab }))} />}
      >
        <ResponsesTable rows={rows} />
      </SectionPanel>
    </>
  );
}

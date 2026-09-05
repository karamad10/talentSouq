import type { Metadata } from "next";
import { BriefcaseBusiness, CheckCircle2, ChevronDown, Clock3, Eye, FileEdit, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { AutoSubmitSelect } from "@/components/dashboard/auto-submit-select";
import { FilterDisclosure, FilterGroup, toArray, toScalar } from "@/components/dashboard/filter-group";
import { JobCard } from "@/components/dashboard/job-cards";
import { ResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCards } from "@/components/ui/metric-cards";
import { Tabs } from "@/components/ui/tabs";
import {
  FilterSummary,
  IconTile,
  MiniMeter,
  PageBody,
  PanelAction,
  SearchField,
  SplitLayout,
  Toolbar,
  WorkspaceHeader
} from "@/components/workspace-ui";
import { employerSummary, workspaceFilters } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer jobs" };

const statusTabs = ["All", "Active", "Drafts", "Closed"] as const;

type JobsSearchParams = {
  status?: string | string[];
  q?: string | string[];
  sort?: string | string[];
  view?: string | string[];
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
  const view = toScalar(params.view, "cards");
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

  const live = employerSummary.responses.filter((row) => row.status !== "Draft");
  const drafts = employerSummary.responses.filter((row) => row.status === "Draft");
  const totalApplicants = employerSummary.responses.reduce((sum, row) => sum + row.total, 0);
  const unreviewed = employerSummary.responses.reduce((sum, row) => sum + row.fresh, 0);
  const totalViews = live.reduce((sum, row) => sum + row.views, 0);

  /** Tabs and the view toggle both need to preserve whatever else is applied. */
  const hrefWith = (patch: { status?: string; view?: string }) => {
    const nextStatus = patch.status ?? status;
    const nextView = patch.view ?? view;
    const search = new URLSearchParams();
    if (nextStatus !== "All") search.set("status", nextStatus);
    if (nextView !== "cards") search.set("view", nextView);
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

      <PageBody>
        {created ? (
          <p
            className="m-0 flex items-center gap-2.5 rounded-ts-xl border border-ts-line-soft bg-ts-success-tint px-5 py-3.5 text-sm font-semibold text-ts-success"
            role="status"
          >
            <CheckCircle2 size={17} aria-hidden="true" />
            Draft created: “{created}”. It appears under Drafts once the backend is connected — this preview does not persist it.
          </p>
        ) : null}

        <MetricCards
          items={[
            { label: "Active listings", value: live.length, detail: "collecting responses", icon: BriefcaseBusiness },
            { label: "Drafts", value: drafts.length, detail: "not published yet", icon: FileEdit },
            { label: "Expiring in 7 days", value: 1, detail: "Frontend Engineer", tone: "attention", icon: Clock3 },
            { label: "Total applicants", value: totalApplicants, detail: `${unreviewed} unreviewed`, icon: UsersRound, href: "/employer/pipeline" }
          ]}
        />

        <Toolbar>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              ariaLabel="Filter jobs by status"
              items={statusTabs.map((tab) => ({ label: tab, href: hrefWith({ status: tab }), current: status === tab }))}
            />
            <Tabs
              ariaLabel="Listing layout"
              items={[
                { label: "Cards", href: hrefWith({ view: "cards" }), current: view !== "table" },
                { label: "Table", href: hrefWith({ view: "table" }), current: view === "table" }
              ]}
            />
          </div>

          <form action="/employer/jobs" className="flex flex-col gap-4">
            {status !== "All" ? <input type="hidden" name="status" value={status} /> : null}
            {view === "table" ? <input type="hidden" name="view" value="table" /> : null}
            <div className="flex flex-wrap items-center gap-2.5">
              <SearchField id="jobs-search" label="Search jobs by title" placeholder="Search jobs by title" defaultValue={q} icon={Search} />
              <label className="sr-only" htmlFor="jobs-sort">
                Sort jobs
              </label>
              <AutoSubmitSelect id="jobs-sort" name="sort" defaultValue={sort}>
                <option value="newest">Sort: Newest first</option>
                <option value="title">Sort: Title A–Z</option>
                <option value="responses">Sort: Most responses</option>
              </AutoSubmitSelect>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center rounded-ts-md bg-ts-primary px-5 text-sm font-bold text-white transition-colors hover:bg-ts-primary-deep"
              >
                Apply
              </button>
            </div>

            <FilterDisclosure
              open={activeFilterCount > 0}
              summary={
                <>
                  <IconTile icon={SlidersHorizontal} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ts-ink">All filters</span>
                    <span className="block text-[13px] font-medium text-ts-muted">
                      {activeFilterCount > 0 ? `${activeFilterCount} active · tap to adjust` : "Category, employment type, work mode and country"}
                    </span>
                  </span>
                  {activeFilterCount > 0 ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-ts-primary px-2.5 text-xs font-bold text-white">{activeFilterCount}</span>
                  ) : null}
                  <ChevronDown size={17} aria-hidden="true" className="shrink-0 text-ts-muted transition-transform group-open/filters:rotate-180" />
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

            <FilterSummary clearHref="/employer/jobs" show={activeFilterCount > 0 || query.length > 0}>
              {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied` : "No filters applied yet"} · {rows.length} of{" "}
              {employerSummary.responses.length} listings
            </FilterSummary>
          </form>
        </Toolbar>

        <SplitLayout
          rail={
            <>
              <SectionPanel title="Needs attention" description="Listings that will stall without a decision." bodyClassName="p-0">
                <ul className="m-0 flex list-none flex-col p-0">
                  {drafts.map((draft) => (
                    <li key={draft.job} className="flex items-center gap-3 px-5 py-3.5">
                      <IconTile icon={FileEdit} tone="muted" size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ts-ink">{draft.job}</span>
                        <span className="block text-[13px] text-ts-muted">Draft — never published</span>
                      </span>
                      <Link href="/employer/jobs" className="shrink-0 text-[13px] font-bold text-ts-primary hover:text-ts-primary-deep">
                        Publish
                      </Link>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 border-t border-ts-line-soft px-5 py-3.5">
                    <IconTile icon={Clock3} tone="accent" size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ts-ink">Frontend Engineer</span>
                      <span className="block text-[13px] text-ts-muted">Expires in 7 days</span>
                    </span>
                    <Link href="/employer/jobs" className="shrink-0 text-[13px] font-bold text-ts-primary hover:text-ts-primary-deep">
                      Extend
                    </Link>
                  </li>
                </ul>
              </SectionPanel>

              <SectionPanel
                title="Reach"
                description={`${totalViews.toLocaleString()} views across live listings.`}
                bodyClassName="flex flex-col gap-4"
                flush
                action={<PanelAction href="/employer/pipeline">Applicants</PanelAction>}
              >
                {live.map((row) => {
                  const rate = row.views > 0 ? Math.round((row.total / row.views) * 1000) / 10 : 0;
                  return (
                    <div key={row.job} className="flex flex-col gap-2">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-[13px] font-semibold text-ts-ink">{row.job}</span>
                        <span className="shrink-0 text-[13px] font-bold text-ts-muted">{rate}%</span>
                      </span>
                      <MiniMeter value={row.views} max={totalViews} ariaLabel={`${row.job} share of views`} />
                      <span className="flex items-center gap-1.5 text-xs text-ts-muted">
                        <Eye size={12} aria-hidden="true" /> {row.views.toLocaleString()} views · {row.total} responses
                      </span>
                    </div>
                  );
                })}
              </SectionPanel>
            </>
          }
        >
          {rows.length === 0 ? (
            <SectionPanel title="All listings" bodyClassName="p-6">
              <EmptyState
                icon={BriefcaseBusiness}
                title="No jobs match these filters"
                description="Try a broader keyword, or clear a filter to see the rest of your listings."
                action={{ href: "/employer/jobs", label: "Clear filters" }}
              />
            </SectionPanel>
          ) : view === "table" ? (
            <SectionPanel
              title="All listings"
              description="Response volume, review progress, and per-row actions for every listing."
              bodyClassName="p-6 max-[680px]:p-4"
              flush
            >
              <ResponsesTable rows={rows} />
            </SectionPanel>
          ) : (
            <div className={cn("grid gap-5", rows.length > 1 && "min-[1600px]:grid-cols-2")}>
              {rows.map((row) => (
                <JobCard key={row.job} row={row} />
              ))}
            </div>
          )}
        </SplitLayout>
      </PageBody>
    </>
  );
}

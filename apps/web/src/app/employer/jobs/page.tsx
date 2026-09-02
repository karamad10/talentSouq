import type { Metadata } from "next";
import { Search } from "lucide-react";
import type { Route } from "next";
import { ResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer jobs" };

const statusTabs = ["All", "Active", "Drafts", "Closed"] as const;

export default async function EmployerJobsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; sort?: string }> }) {
  const { status = "All", q = "", sort = "newest" } = await searchParams;
  const query = q.trim().toLowerCase();
  const rows = employerSummary.responses
    .filter((row) => status === "All" || (status === "Closed" ? false : row.status === status.replace(/s$/, "")))
    .filter((row) => !query || row.job.toLowerCase().includes(query))
    .sort((a, b) => (sort === "title" ? a.job.localeCompare(b.job) : 0));

  const tabHref = (tab: string) => `/employer/jobs?status=${tab}${q ? `&q=${encodeURIComponent(q)}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}` as Route;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Listings"
        title="Jobs"
        description="Create, publish, feature, pause, and measure every vacancy."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
            storageKey="employer-jobs-post"
            pendingLabel="Creating…"
            successLabel="Draft created"
          >
            Post a job
          </PreviewActionButton>
        }
      />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Active", value: 2 },
          { label: "Draft", value: 1 },
          { label: "Expiring in 7 days", value: 1, detail: "Frontend Engineer", tone: "attention" },
          { label: "Total applicants", value: 42 }
        ]}
      />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Tabs ariaLabel="Filter jobs by status" items={statusTabs.map((tab) => ({ label: tab, href: tabHref(tab), current: status === tab }))} />
        <form action="/employer/jobs" className="flex items-center gap-2" role="search">
          <input type="hidden" name="status" value={status} />
          {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
          <label className="sr-only" htmlFor="jobs-search">
            Search jobs by title
          </label>
          <div className="flex h-8 items-center gap-2 rounded-ts-md border border-ts-field bg-ts-surface px-2.5 transition-colors focus-within:border-ts-primary">
            <Search size={14} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="jobs-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search jobs"
              className="w-44 min-w-0 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
          <label className="sr-only" htmlFor="jobs-sort">
            Sort jobs
          </label>
          <select
            id="jobs-sort"
            name="sort"
            defaultValue={sort}
            className="h-8 rounded-ts-md border border-ts-field bg-ts-surface px-2 text-[13px] text-ts-ink"
          >
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
          </select>
          <button type="submit" className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}>
            Apply
          </button>
        </form>
      </div>
      <SectionPanel title="All listings" description="Response volume, review progress, and per-row actions for every listing.">
        <ResponsesTable rows={rows} />
      </SectionPanel>
    </>
  );
}

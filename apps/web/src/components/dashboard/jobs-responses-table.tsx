import { ArrowUpRight, BriefcaseBusiness, MoreHorizontal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import type { employerSummary } from "@/data/workspace";

type ResponseRow = (typeof employerSummary.responses)[number];

function RowActions({ row }: { row: ResponseRow }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${row.job}`}
        className="inline-flex size-9 items-center justify-center rounded-ts-md text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem asChild>
          <Link href="/employer/pipeline">View applicants</Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href="/employer/jobs">Manage listing</Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href="/employer/candidates">Source similar profiles</Link>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

export function JobsResponsesTable({ rows, filter, basePath = "/employer" as Route }: { rows: ResponseRow[]; filter: string; basePath?: Route }) {
  const counts = {
    all: rows.length,
    active: rows.filter((row) => row.status === "Active").length,
    drafts: rows.filter((row) => row.status === "Draft").length
  };
  const visible =
    filter === "Active" ? rows.filter((row) => row.status === "Active") : filter === "Drafts" ? rows.filter((row) => row.status === "Draft") : rows;

  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs
        ariaLabel="Filter jobs by status"
        items={[
          { label: "All jobs", href: basePath, count: counts.all, current: filter !== "Active" && filter !== "Drafts" },
          { label: "Active", href: `${basePath}?jobs=Active` as Route, count: counts.active, current: filter === "Active" },
          { label: "Drafts", href: `${basePath}?jobs=Drafts` as Route, count: counts.drafts, current: filter === "Drafts" }
        ]}
      />
      <ResponsesTable rows={visible} />
      <ResponsesSummary rows={visible} />
    </div>
  );
}

/** Aggregates under the table, so the panel ends on something useful. */
function ResponsesSummary({ rows }: { rows: ResponseRow[] }) {
  if (rows.length === 0) return null;
  const live = rows.filter((row) => row.status !== "Draft");
  const totalResponses = live.reduce((sum, row) => sum + row.total, 0);
  const fresh = live.reduce((sum, row) => sum + row.fresh, 0);
  const reviewed = live.length > 0 ? Math.round(live.reduce((sum, row) => sum + row.reviewedPct, 0) / live.length) : 0;

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ts-line pt-4">
      <dl className="m-0 flex flex-wrap items-center gap-x-6 gap-y-2">
        {[
          { label: "Total responses", value: totalResponses },
          { label: "Unreviewed", value: fresh },
          { label: "Average reviewed", value: `${reviewed}%` }
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <dt className="text-[13px] text-ts-muted">{stat.label}</dt>
            <dd className="m-0 text-sm font-bold text-ts-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <Link href="/employer/jobs/new" className="inline-flex items-center gap-1.5 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
        Post another role <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
      </Link>
    </div>
  );
}

/** The pure per-job response analytics table, reusable outside the tabbed home module. */
export function ResponsesTable({ rows: visible }: { rows: ResponseRow[] }) {
  return (
    <>
      {visible.length === 0 ? (
        <EmptyState icon={BriefcaseBusiness} title="No jobs here yet" description="Post your first role to start collecting responses." action={{ href: "/employer/jobs", label: "Post a job" }} />
      ) : (
        <div className="-mx-1 min-h-0 flex-1 overflow-x-auto px-1">
          <table className="h-full w-full min-w-190 border-collapse text-start">
            {/* Percentage widths keep the table fluid inside any panel width. */}
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
              <col className="w-[11%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
              <col className="w-[12%]" />
              <col className="w-[4%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-ts-line text-start">
                <th scope="col" className="pb-3 pe-4 text-start text-[13px] font-semibold text-ts-muted">Role</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Status</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Responses</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Shortlisted</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Rejected</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Views</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Reviewed</th>
                <th scope="col" className="pb-3 ps-4 text-end text-[13px] font-semibold text-ts-muted">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.job} className="border-b border-ts-line last:border-b-0">
                  <td className="py-4 pe-4">
                    <p className="m-0 text-[15px] font-bold text-ts-ink">{row.job}</p>
                    <p className="m-0 mt-1 text-[13px] text-ts-muted">
                      {row.category} · {row.mode} · {row.updated}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill status={row.status} className="px-3 py-1 text-xs" />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[15px] font-bold text-ts-ink">{row.status === "Draft" ? "—" : row.total}</span>
                    {row.fresh > 0 ? (
                      <span className="ms-2 inline-flex h-6 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{row.fresh} new</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-ts-success">{row.status === "Draft" ? "—" : row.shortlisted}</td>
                  <td className="px-4 py-4 text-sm text-ts-muted">{row.status === "Draft" ? "—" : row.rejected}</td>
                  <td className="px-4 py-4 text-sm text-ts-ink">{row.status === "Draft" ? "—" : row.views}</td>
                  <td className="px-4 py-4">
                    {row.status === "Draft" ? (
                      <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep">
                        Publish <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2.5">
                        <span
                          role="progressbar"
                          aria-label={`${row.job} responses reviewed`}
                          aria-valuenow={row.reviewedPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="h-2 w-16 min-w-8 flex-1 overflow-hidden rounded-full bg-ts-surface-2"
                        >
                          <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${row.reviewedPct}%` }} />
                        </span>
                        <span className="shrink-0 text-[13px] font-bold text-ts-ink">{row.reviewedPct}%</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 ps-4 text-end">
                    <RowActions row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

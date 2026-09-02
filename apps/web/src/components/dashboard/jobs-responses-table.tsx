import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import { BriefcaseBusiness } from "lucide-react";
import type { employerSummary } from "@/data/workspace";

type ResponseRow = (typeof employerSummary.responses)[number];

function RowActions({ row }: { row: ResponseRow }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${row.job}`}
        className="inline-flex size-7 items-center justify-center rounded-ts-sm text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
      >
        <MoreHorizontal size={16} aria-hidden="true" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem asChild>
          <Link href="/employer/pipeline">View applicants</Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href="/employer/jobs">Manage listing</Link>
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
    <div className="flex flex-col gap-3">
      <Tabs
        ariaLabel="Filter jobs by status"
        items={[
          { label: "All jobs", href: basePath, count: counts.all, current: filter !== "Active" && filter !== "Drafts" },
          { label: "Active", href: `${basePath}?jobs=Active` as Route, count: counts.active, current: filter === "Active" },
          { label: "Drafts", href: `${basePath}?jobs=Drafts` as Route, count: counts.drafts, current: filter === "Drafts" }
        ]}
      />
      <ResponsesTable rows={visible} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-start">
            <thead>
              <tr className="border-b border-ts-line text-start">
                <th scope="col" className="pb-2 pe-3 text-start text-xs font-semibold text-ts-muted">Role</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Status</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Responses</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Shortlisted</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Rejected</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Views</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Reviewed</th>
                <th scope="col" className="pb-2 ps-3 text-end text-xs font-semibold text-ts-muted">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.job} className="border-b border-ts-line last:border-b-0">
                  <td className="py-3 pe-3">
                    <p className="m-0 text-sm font-semibold text-ts-ink">{row.job}</p>
                    <p className="m-0 text-xs text-ts-muted">{row.updated}</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-bold text-ts-ink">{row.status === "Draft" ? "—" : row.total}</span>
                    {row.fresh > 0 ? (
                      <span className="ms-2 inline-flex h-4.5 items-center rounded-full bg-ts-primary-tint px-1.5 text-[11px] font-bold text-ts-primary-deep">
                        {row.fresh} new
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-ts-success">{row.status === "Draft" ? "—" : row.shortlisted}</td>
                  <td className="px-3 py-3 text-sm text-ts-muted">{row.status === "Draft" ? "—" : row.rejected}</td>
                  <td className="px-3 py-3 text-sm text-ts-ink">{row.status === "Draft" ? "—" : row.views}</td>
                  <td className="px-3 py-3">
                    {row.status === "Draft" ? (
                      <Link href="/employer/jobs" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                        Publish <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span
                          role="progressbar"
                          aria-label={`${row.job} responses reviewed`}
                          aria-valuenow={row.reviewedPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          className="h-1.5 w-16 overflow-hidden rounded-full bg-ts-surface-2"
                        >
                          <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${row.reviewedPct}%` }} />
                        </span>
                        <span className="text-xs font-semibold text-ts-muted">{row.reviewedPct}%</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 ps-3 text-end">
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

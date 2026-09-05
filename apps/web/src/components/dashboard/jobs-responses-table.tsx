import { ArrowUpRight, BriefcaseBusiness, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { StatusPill } from "@/components/ui/status-pill";
import type { JobRow } from "@/components/dashboard/job-cards";

function RowActions({ row }: { row: JobRow }) {
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

/** The dense scanning view of the same listings the job cards show. */
export function ResponsesTable({ rows: visible }: { rows: JobRow[] }) {
  if (visible.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No jobs here yet"
        description="Post your first role to start collecting responses."
        action={{ href: "/employer/jobs", label: "Post a job" }}
      />
    );
  }

  return (
    <div className="-mx-1 min-h-0 flex-1 overflow-x-auto px-1">
      <table className="w-full min-w-190 border-collapse text-start">
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
          <tr className="border-b border-ts-line-soft text-start">
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
            <tr key={row.job} className="border-b border-ts-line-soft last:border-b-0">
              <td className="py-3.5 pe-4">
                <p className="m-0 text-sm font-bold text-ts-ink">{row.job}</p>
                <p className="m-0 mt-0.5 text-[13px] text-ts-muted">
                  {row.category} · {row.mode} · {row.updated}
                </p>
              </td>
              <td className="px-4 py-3.5">
                <StatusPill status={row.status} className="px-2.5 py-0.5 text-[11px]" />
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm font-bold text-ts-ink">{row.status === "Draft" ? "—" : row.total}</span>
                {row.fresh > 0 ? (
                  <span className="ms-2 inline-flex h-5.5 items-center rounded-full bg-ts-accent-tint px-2 text-[11px] font-bold text-ts-accent-deep">
                    {row.fresh} new
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3.5 text-sm font-bold text-ts-success">{row.status === "Draft" ? "—" : row.shortlisted}</td>
              <td className="px-4 py-3.5 text-sm text-ts-muted">{row.status === "Draft" ? "—" : row.rejected}</td>
              <td className="px-4 py-3.5 text-sm text-ts-ink">{row.status === "Draft" ? "—" : row.views}</td>
              <td className="px-4 py-3.5">
                {row.status === "Draft" ? (
                  <Link
                    href="/employer/jobs"
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep"
                  >
                    Publish <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-2.5">
                    <span
                      role="progressbar"
                      aria-label={`${row.job} responses reviewed`}
                      aria-valuenow={row.reviewedPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 w-16 min-w-8 flex-1 overflow-hidden rounded-full bg-ts-surface-2"
                    >
                      <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${row.reviewedPct}%` }} />
                    </span>
                    <span className="shrink-0 text-[13px] font-bold text-ts-ink">{row.reviewedPct}%</span>
                  </span>
                )}
              </td>
              <td className="py-3.5 ps-4 text-end">
                <RowActions row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

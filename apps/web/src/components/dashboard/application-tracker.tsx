import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import type { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

type ApplicationRow = (typeof seekerSummary.applications)[number];

/** Two-letter company monogram, so each row has a visual anchor to scan by. */
function monogram(company: string) {
  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ApplicationTracker({
  rows,
  view,
  basePath = "/seeker" as Route,
  counts
}: {
  rows: ApplicationRow[];
  view: string;
  basePath?: Route;
  counts: { all: number; easy: number; external: number };
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs
        ariaLabel="Filter applications"
        items={[
          { label: "All", href: basePath, count: counts.all, current: view !== "easy" && view !== "external" },
          { label: "Easy applies", href: `${basePath}?view=easy` as Route, count: counts.easy, current: view === "easy" },
          { label: "External", href: `${basePath}?view=external` as Route, count: counts.external, current: view === "external" }
        ]}
      />
      <ApplicationsTable rows={rows} />
      <TrackerSummary rows={rows} />
    </div>
  );
}

/** Aggregates under the table: what the rows add up to, and where to go next. */
function TrackerSummary({ rows }: { rows: ApplicationRow[] }) {
  if (rows.length === 0) {
    return null;
  }
  const averageMatch = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
  const awaitingYou = rows.filter((row) => row.stage === "Interview" || row.stage === "Offer").length;

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ts-line pt-4">
      <dl className="m-0 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-2">
          <dt className="text-[13px] text-ts-muted">Average match</dt>
          <dd className="m-0 text-sm font-bold text-ts-ink">{averageMatch}%</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-[13px] text-ts-muted">Waiting on you</dt>
          <dd className="m-0 text-sm font-bold text-ts-ink">{awaitingYou}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-[13px] text-ts-muted">Longest wait</dt>
          <dd className="m-0 text-sm font-bold text-ts-ink">{rows[rows.length - 1]?.updated}</dd>
        </div>
      </dl>
      <Link href="/seeker/jobs" className="inline-flex items-center gap-1.5 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
        Add another application <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
      </Link>
    </div>
  );
}

/** The pure application table, reusable with page-specific tab sets. */
export function ApplicationsTable({ rows }: { rows: ApplicationRow[] }) {
  return (
    <>
      {rows.length === 0 ? (
        <EmptyState icon={BriefcaseBusiness} title="No applications yet" description="Roles you apply to will show up here with their live status." action={{ href: "/seeker/jobs", label: "Discover jobs" }} />
      ) : (
        <div className="-mx-1 min-h-0 flex-1 overflow-x-auto px-1">
          <table className="h-full w-full min-w-170 border-collapse">
            {/* Percentage widths keep every column fluid: the table fills the
                card at any width and only scrolls below its 680px minimum. */}
            <colgroup>
              <col className="w-[33%]" />
              <col className="w-[13%]" />
              <col className="w-[18%]" />
              <col className="w-[23%]" />
              <col className="w-[13%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-ts-line">
                <th scope="col" className="pb-3 pe-4 text-start text-[13px] font-semibold text-ts-muted">Company &amp; role</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Stage</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Match</th>
                <th scope="col" className="px-4 pb-3 text-start text-[13px] font-semibold text-ts-muted">Next step</th>
                <th scope="col" className="pb-3 ps-4 text-end text-[13px] font-semibold text-ts-muted">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const needsAction = row.stage === "Interview";
                return (
                  <tr key={`${row.company}-${row.role}`} className={cn("border-b border-ts-line last:border-b-0", needsAction && "bg-ts-primary-tint/40")}>
                    <td className="py-4 pe-4">
                      <span className="flex items-center gap-3.5">
                        <span
                          aria-hidden="true"
                          className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-sm font-bold text-ts-primary-deep"
                        >
                          {monogram(row.company)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] text-ts-muted">{row.company}</span>
                          <span className="block truncate text-[15px] font-bold text-ts-ink">{row.role}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={row.stage} className="px-3 py-1 text-xs" />
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2.5">
                        <span className="w-9 shrink-0 text-sm font-bold text-ts-ink">{row.score}%</span>
                        <span aria-hidden="true" className="h-2 w-16 min-w-10 flex-1 overflow-hidden rounded-full bg-ts-surface-2">
                          <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${row.score}%` }} />
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {needsAction ? (
                        <Link href="/seeker/offers" className="inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep">
                          {row.nextStep} <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
                        </Link>
                      ) : (
                        <span className="text-sm whitespace-nowrap text-ts-ink">{row.nextStep}</span>
                      )}
                    </td>
                    <td className="py-4 ps-4 text-end text-[13px] whitespace-nowrap text-ts-muted">{row.updated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

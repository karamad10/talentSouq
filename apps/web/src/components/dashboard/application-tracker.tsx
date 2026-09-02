import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import type { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

type ApplicationRow = (typeof seekerSummary.applications)[number];

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
    <div className="flex flex-col gap-3">
      <Tabs
        ariaLabel="Filter applications"
        items={[
          { label: "All", href: basePath, count: counts.all, current: view !== "easy" && view !== "external" },
          { label: "Easy applies", href: `${basePath}?view=easy` as Route, count: counts.easy, current: view === "easy" },
          { label: "External", href: `${basePath}?view=external` as Route, count: counts.external, current: view === "external" }
        ]}
      />
      <ApplicationsTable rows={rows} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-155 border-collapse">
            <thead>
              <tr className="border-b border-ts-line">
                <th scope="col" className="pb-2 pe-3 text-start text-xs font-semibold text-ts-muted">Company &amp; role</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Stage</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Match</th>
                <th scope="col" className="px-3 pb-2 text-start text-xs font-semibold text-ts-muted">Next step</th>
                <th scope="col" className="pb-2 ps-3 text-end text-xs font-semibold text-ts-muted">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const needsAction = row.stage === "Interview";
                return (
                  <tr key={`${row.company}-${row.role}`} className={cn("border-b border-ts-line last:border-b-0", needsAction && "bg-ts-primary-tint/40")}>
                    <td className="py-3 pe-3">
                      <p className="m-0 text-xs text-ts-muted">{row.company}</p>
                      <p className="m-0 text-sm font-semibold text-ts-ink">{row.role}</p>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={row.stage} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ts-ink">{row.score}%</span>
                        <span aria-hidden="true" className="h-1.5 w-14 overflow-hidden rounded-full bg-ts-surface-2">
                          <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${row.score}%` }} />
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {needsAction ? (
                        <Link href="/seeker/offers" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                          {row.nextStep} <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
                        </Link>
                      ) : (
                        <span className="text-[13px] text-ts-ink">{row.nextStep}</span>
                      )}
                    </td>
                    <td className="py-3 ps-3 text-end text-xs text-ts-muted">{row.updated}</td>
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

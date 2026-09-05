import { ArrowUpRight, BriefcaseBusiness, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { StatusPill } from "@/components/ui/status-pill";
import { MiniMeter, StatGrid } from "@/components/workspace-ui";
import type { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export type JobRow = (typeof employerSummary.responses)[number];

function RowActions({ row }: { row: JobRow }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${row.job}`}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-ts-md text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
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

/**
 * One listing as a card: identity on top, the numbers in their own band, and
 * review progress with the actions at the foot. Drafts have no numbers to show,
 * so they get a publish prompt in place of the stats band.
 */
export function JobCard({ row }: { row: JobRow }) {
  const draft = row.status === "Draft";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-ts-xl border border-ts-line-soft bg-ts-surface shadow-ts-card transition-colors hover:border-ts-line-soft">
      <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
        <span
          aria-hidden="true"
          className={cn("grid size-10 shrink-0 place-items-center rounded-ts-md", draft ? "bg-ts-surface-2 text-ts-muted" : "bg-ts-primary-tint text-ts-primary")}
        >
          <BriefcaseBusiness size={18} />
        </span>
        <div className="min-w-0 flex-1">
          {/* Badges lead the card so a long role title never pushes them onto
              their own line and knocks the two cards in a row out of step. */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={row.status} className="px-2.5 py-0.5 text-[11px]" />
            {row.fresh > 0 ? (
              <span className="inline-flex h-6 items-center rounded-full bg-ts-accent-tint px-2.5 text-[11px] font-bold text-ts-accent-deep">{row.fresh} new</span>
            ) : null}
          </div>
          <h3 className="m-0 mt-2 text-[17px] leading-tight font-bold tracking-[-0.015em] text-ts-ink">{row.job}</h3>
          <p className="m-0 mt-1.5 text-[13px] text-ts-muted">
            {row.category} · {row.type} · {row.mode} · {row.location}
          </p>
        </div>
        <RowActions row={row} />
      </div>

      {draft ? (
        <div className="mx-5 mt-auto mb-5 flex flex-wrap items-center justify-between gap-3 rounded-ts-md border border-dashed border-ts-line-soft px-4 py-3.5">
          <p className="m-0 text-[13px] text-ts-muted">Not published yet — publish it to start collecting responses.</p>
          <Link
            href="/employer/jobs"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ts-md bg-ts-primary px-4 text-[13px] font-bold text-white transition-colors hover:bg-ts-primary-deep"
          >
            Publish <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-auto border-y border-ts-line-soft bg-ts-surface-2/40 px-5 py-4">
            <StatGrid
              items={[
                { label: "Responses", value: row.total },
                { label: "Shortlisted", value: row.shortlisted, tone: "success" },
                { label: "Rejected", value: row.rejected, tone: "muted" },
                { label: "Views", value: row.views.toLocaleString() }
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-40 flex-1">
              <MiniMeter label="Responses reviewed" value={row.reviewedPct} caption={`${row.reviewedPct}%`} ariaLabel={`${row.job} responses reviewed`} />
            </div>
            <Link
              href="/employer/pipeline"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
            >
              <Users size={14} aria-hidden="true" /> Applicants
            </Link>
          </div>
        </>
      )}
    </article>
  );
}

/**
 * The condensed listing row used on the home overview, where the listing is
 * context for the day rather than the subject of the page.
 */
export function JobSummaryRow({ row }: { row: JobRow }) {
  const draft = row.status === "Draft";

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-4 transition-colors hover:bg-ts-surface-2/50 max-[680px]:px-4">
      <div className="min-w-45 flex-1">
        <p className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] font-bold text-ts-ink">
          {row.job}
          <StatusPill status={row.status} className="px-2.5 py-0.5 text-[11px]" />
        </p>
        <p className="m-0 mt-1 text-[13px] text-ts-muted">
          {row.category} · {row.mode} · {row.updated}
        </p>
      </div>

      {draft ? (
        <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep">
          Publish <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      ) : (
        <>
          <div className="flex shrink-0 items-baseline gap-1.5">
            <strong className="text-[17px] leading-none font-bold text-ts-ink">{row.total}</strong>
            <span className="text-xs text-ts-muted">responses</span>
            {row.fresh > 0 ? (
              <span className="ms-1 inline-flex h-5.5 items-center rounded-full bg-ts-accent-tint px-2 text-[11px] font-bold text-ts-accent-deep">
                +{row.fresh}
              </span>
            ) : null}
          </div>
          <div className="w-40 shrink-0 max-[520px]:w-full">
            <MiniMeter value={row.reviewedPct} caption={`${row.reviewedPct}% reviewed`} ariaLabel={`${row.job} responses reviewed`} />
          </div>
        </>
      )}
    </div>
  );
}

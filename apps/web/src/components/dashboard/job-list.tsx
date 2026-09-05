import { ArrowUpRight, MapPin, Users, Zap } from "lucide-react";
import Link from "next/link";
import { BookmarkToggle } from "@/components/interaction-ui";
import type { Job } from "@/data/jobs";
import { cn } from "@/lib/cn";

/** "AED 28k–34k" — compact enough to sit in a table row. */
export function salaryLabel(job: Job) {
  const short = (value: number) => `${Math.round(value / 100) / 10}k`.replace(".0k", "k");
  return `${job.currency} ${short(job.salaryMin)}–${short(job.salaryMax)}`;
}

function MatchPill({ score }: { score: number }) {
  const strong = score >= 80;
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-[13px] font-bold",
        strong ? "bg-ts-primary-tint text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
      )}
      title={`${score}% match with your profile`}
    >
      {score}%
    </span>
  );
}

/**
 * One search result, as a scannable row: identity on the left, the facts that
 * decide a click in the middle, and the actions pinned right.
 */
export function JobRow({ job }: { job: Job }) {
  return (
    <li className="border-t border-ts-line-soft first:border-t-0">
      <div className="group relative flex items-center gap-4 px-6 py-4 transition-colors hover:bg-ts-primary-tint/30 max-[680px]:flex-wrap max-[680px]:px-4">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-ts-md text-sm font-bold text-ts-ink/80"
          style={{ backgroundColor: job.accent }}
        >
          {job.initials}
        </span>

        <span className="flex min-w-0 flex-[2] flex-col gap-1">
          <Link href={`/jobs/${job.id}`} className="text-[15px] font-bold text-ts-ink after:absolute after:inset-0 group-hover:text-ts-primary-deep">
            {job.title}
          </Link>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ts-muted">
            <span className="font-semibold text-ts-ink/80">{job.company}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} aria-hidden="true" /> {job.location}
            </span>
            <span aria-hidden="true">·</span>
            <span>{job.mode}</span>
          </span>
        </span>

        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 max-[981px]:hidden">
          <span className="inline-flex h-7 items-center rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-muted">{job.type}</span>
          <span className="inline-flex h-7 items-center rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-muted">{job.seniority}</span>
          {job.easyApply ? (
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-ts-accent-tint px-2.5 text-xs font-bold text-ts-accent-deep">
              <Zap size={12} aria-hidden="true" /> Easy apply
            </span>
          ) : null}
        </span>

        <span className="w-28 shrink-0 text-[13px] font-semibold text-ts-ink max-[1180px]:hidden">{salaryLabel(job)}</span>

        <span className="hidden w-24 shrink-0 items-center gap-1.5 text-[13px] text-ts-muted min-[1400px]:inline-flex">
          <Users size={13} aria-hidden="true" /> {job.applicants}
        </span>

        <span className="w-20 shrink-0 text-end text-[13px] text-ts-muted max-[680px]:hidden">{job.posted}</span>

        <MatchPill score={job.matchScore} />

        <span className="relative z-2 flex shrink-0 items-center gap-1">
          <BookmarkToggle
            storageKey={`talentsouq:job:${job.id}:saved`}
            label={job.title}
            size={17}
            className="grid size-10 place-items-center rounded-full border border-ts-line-soft text-ts-muted transition-colors hover:border-ts-primary hover:text-ts-primary-deep aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
          />
          <Link
            href={`/jobs/${job.id}`}
            aria-label={`View ${job.title}`}
            className="grid size-10 place-items-center rounded-full border border-ts-line-soft text-ts-muted transition-colors hover:border-ts-primary hover:bg-ts-primary-tint hover:text-ts-primary-deep"
          >
            <ArrowUpRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </span>
      </div>
    </li>
  );
}

export function JobRows({ jobs: rows }: { jobs: Job[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {rows.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </ul>
  );
}

/** Recommended roles as a horizontal strip — scannable without eating the page. */
export function JobStrip({ jobs: rows }: { jobs: Job[] }) {
  return (
    <ul className="m-0 flex snap-x snap-mandatory list-none gap-4 overflow-x-auto p-0 pb-1">
      {rows.map((job) => (
        <li key={job.id} className="min-w-70 flex-1 snap-start">
          <article className="group relative flex h-full flex-col gap-3 rounded-ts-md border border-ts-line-soft bg-ts-surface p-4 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/30">
            <div className="flex items-start justify-between gap-3">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md text-sm font-bold text-ts-ink/80" style={{ backgroundColor: job.accent }}>
                {job.initials}
              </span>
              <MatchPill score={job.matchScore} />
            </div>
            <div className="min-w-0">
              <Link href={`/jobs/${job.id}`} className="block truncate text-[15px] font-bold text-ts-ink after:absolute after:inset-0 group-hover:text-ts-primary-deep">
                {job.title}
              </Link>
              <p className="m-0 mt-1 truncate text-[13px] text-ts-muted">
                {job.company} · {job.location}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-ts-line-soft pt-3 text-xs font-semibold text-ts-muted">
              <span>{salaryLabel(job)}</span>
              <span aria-hidden="true">·</span>
              <span>{job.mode}</span>
              <span className="ms-auto">{job.posted}</span>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

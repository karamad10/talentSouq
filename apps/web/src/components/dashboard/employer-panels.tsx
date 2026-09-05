import { ArrowUpRight, CalendarDays, MonitorPlay, Search, Sparkles } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { MiniMeter, PanelAction, PersonAvatar } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------- the focus */

/**
 * The single hiring action that matters most today, with the rest of the day's
 * queue beside it. This is the only band on the page allowed to use the tinted
 * surface — that is what makes it read as the priority.
 */
export function EmployerSpotlight() {
  const [lead, ...alsoToday] = employerSummary.tasks;

  return (
    <section className="grid gap-6 overflow-hidden rounded-ts-xl border border-ts-primary/20 bg-ts-primary-tint p-6 min-[1180px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[1180px]:items-center max-[680px]:p-5">
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-ts-primary-deep uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ts-accent" />
          Needs you today
        </p>
        <h2 className="m-0 mt-3 text-[24px] leading-[1.2] font-bold tracking-[-0.025em] text-ts-ink max-[680px]:text-[20px]">{lead.title}</h2>
        <p className="m-0 mt-2 text-sm text-ts-muted">Three score above 90% and none have been reviewed yet.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Link
            href={lead.href}
            className="inline-flex h-11 items-center gap-2 rounded-ts-md bg-ts-primary-deep px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Review applicants <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/employer/jobs/new"
            className="inline-flex h-11 items-center gap-2 rounded-ts-md border border-ts-primary/25 bg-ts-surface px-5 text-sm font-bold text-ts-primary-deep transition-colors hover:bg-ts-surface-2"
          >
            Post a job
          </Link>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {alsoToday.map((task) => (
          <li key={task.title}>
            <Link
              href={task.href}
              className="group flex items-center gap-3 rounded-ts-md bg-ts-surface px-4 py-3.5 transition-colors hover:bg-ts-surface-2"
            >
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
                <Sparkles size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ts-ink group-hover:text-ts-primary-deep">{task.title}</span>
                <span className="block truncate text-[13px] text-ts-muted">{task.detail}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold whitespace-nowrap text-ts-muted">{task.when}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------- rail panels */

export function TodayPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Today"
      description="Your hiring team’s next actions."
      className={className}
      bodyClassName="p-0"
      action={<PanelAction href="/employer/notifications">All activity</PanelAction>}
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {employerSummary.tasks.map((task, index) => (
          <li key={task.title} className={cn(index > 0 && "border-t border-ts-line-soft")}>
            <Link href={task.href} className="group flex w-full items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ts-surface-2/60">
              <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 self-start rounded-full bg-ts-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-snug font-bold text-ts-ink group-hover:text-ts-primary-deep">{task.title}</span>
                <span className="mt-0.5 block truncate text-[13px] text-ts-muted">{task.detail}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold whitespace-nowrap text-ts-muted">{task.when}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export function InterviewsPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Interviews"
      description="Scheduled across the team this week."
      className={className}
      bodyClassName="p-0"
      action={<PanelAction href="/employer/interviews">Calendar</PanelAction>}
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {employerSummary.interviewsList.map((interview, index) => {
          const [day, time] = interview.date.split(" · ");
          return (
            <li key={interview.candidate} className={cn("flex items-center gap-3 px-5 py-3.5", index > 0 && "border-t border-ts-line-soft")}>
              <PersonAvatar name={interview.candidate} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ts-ink">{interview.candidate}</span>
                <span className="flex items-center gap-1.5 text-[13px] text-ts-muted">
                  {interview.mode === "Video" ? <MonitorPlay size={12} aria-hidden="true" /> : <CalendarDays size={12} aria-hidden="true" />}
                  <span className="truncate">{interview.role}</span>
                </span>
              </span>
              <span className="shrink-0 text-end">
                <span className="block text-xs font-bold whitespace-nowrap text-ts-primary">{day}</span>
                <span className="block text-xs whitespace-nowrap text-ts-muted">{time}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </SectionPanel>
  );
}

export function CreditsPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Plan & credits"
      description={`${employerSummary.plan.name} plan · renews ${employerSummary.plan.renewal}`}
      className={className}
      bodyClassName="flex flex-col gap-3.5"
      flush
      action={<PanelAction href="/employer/billing">Manage</PanelAction>}
    >
      {employerSummary.creditMeters.map((meter) => (
        <MiniMeter key={meter.label} label={meter.label} value={meter.used} max={meter.total} caption={`${meter.used}/${meter.total}`} warnAt={80} />
      ))}
    </SectionPanel>
  );
}

/** Saved searches, as a shortcut back into sourcing without repeating that page. */
export function SavedSearchesPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Saved searches"
      description="Fresh profiles since you last looked."
      className={className}
      bodyClassName="p-0"
      action={<PanelAction href="/employer/candidates">Search</PanelAction>}
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {employerSummary.savedSearches.map((saved, index) => (
          <li key={saved.name} className={cn(index > 0 && "border-t border-ts-line-soft")}>
            <Link
              href={`/employer/candidates?q=${encodeURIComponent(saved.name)}` as Route}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ts-surface-2/60"
            >
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
                <Search size={14} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ts-ink group-hover:text-ts-primary-deep">{saved.name}</span>
              <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2.5 text-xs font-bold text-ts-primary-deep">
                +{saved.fresh}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

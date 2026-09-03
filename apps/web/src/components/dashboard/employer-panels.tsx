import { ArrowUpRight, CalendarDays, ClipboardCheck, CreditCard, FolderKanban, MonitorPlay, Search, Sparkles, UserPlus, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

const quickActions: { icon: LucideIcon; label: string; detail: string; href: Route }[] = [
  { icon: UsersRound, label: "Review applicants", detail: `${employerSummary.newApplicants} waiting`, href: "/employer/pipeline" },
  { icon: Search, label: "Search CVs", detail: `${employerSummary.candidates.length} matching profiles`, href: "/employer/candidates" },
  { icon: CalendarDays, label: "Interview center", detail: `${employerSummary.interviews} this week`, href: "/employer/interviews" },
  { icon: ClipboardCheck, label: "Send an assessment", detail: "2 templates ready", href: "/employer/assessments" },
  { icon: UserPlus, label: "Invite a colleague", detail: `${employerSummary.plan.seats} seats used`, href: "/employer/team" },
  { icon: CreditCard, label: "Plan & credits", detail: `${employerSummary.plan.credits} credits left`, href: "/employer/billing" }
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The one hiring action that matters most today, with the two other live items
 * beside it so the band carries its full width.
 */
export function EmployerSpotlight() {
  const [, ...alsoToday] = employerSummary.tasks;

  return (
    <section className="grid gap-6 overflow-hidden rounded-ts-lg border border-ts-primary/25 bg-ts-primary-tint px-8 py-6 min-[1400px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[1400px]:items-center max-[680px]:px-5 max-[680px]:py-5">
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-ts-primary-deep uppercase">
          <span aria-hidden="true" className="inline-block size-2 rounded-full bg-ts-accent" />
          Needs you today
        </p>
        <h2 className="m-0 mt-2.5 text-[26px] leading-[1.15] font-bold tracking-[-0.025em] text-ts-ink max-[680px]:text-[22px]">
          7 new applicants on Senior Product Designer
        </h2>
        <p className="m-0 mt-2 text-sm text-ts-muted">Three score above 90% and none have been reviewed yet.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/employer/pipeline"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md bg-ts-primary-deep px-6 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Review applicants <ArrowUpRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/employer/jobs/new"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md border border-ts-primary/40 bg-ts-surface px-6 text-[15px] font-bold text-ts-primary-deep transition-colors hover:bg-ts-surface-2"
          >
            Post a job
          </Link>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-ts-md bg-ts-primary/15 p-0">
        {alsoToday.map((task) => (
          <li key={task.title}>
            <Link href={task.href} className="group flex items-center gap-3.5 bg-ts-surface px-5 py-4 transition-colors hover:bg-ts-surface-2">
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
                <Sparkles size={17} />
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

export function TodayPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Today"
      description="Your hiring team’s next actions."
      className={className}
      bodyClassName="flex flex-col p-0"
      action={
        <Link href="/employer/notifications" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          All activity <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col p-0">
        {employerSummary.tasks.map((task, index) => (
          <li key={task.title} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
            <Link href={task.href} className="group flex w-full items-center gap-3.5 px-6 py-4 transition-colors hover:bg-ts-primary-tint/40 max-[680px]:px-4">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
                <FolderKanban size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{task.title}</span>
                <span className="block truncate text-[13px] text-ts-muted">{task.detail}</span>
              </span>
              <span className="shrink-0 text-[13px] font-semibold whitespace-nowrap text-ts-muted">{task.when}</span>
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
      bodyClassName="flex flex-col p-0"
      action={
        <Link href="/employer/interviews" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Open calendar <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col p-0">
        {employerSummary.interviewsList.map((interview, index) => (
          <li key={interview.candidate} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
            <div className="flex w-full items-center gap-3.5 px-6 py-4 max-[680px]:px-4">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
                {interview.mode === "Video" ? <MonitorPlay size={18} /> : <CalendarDays size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-ts-ink">{interview.candidate}</span>
                <span className="block truncate text-[13px] text-ts-muted">
                  {interview.role} · {interview.panel}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-bold whitespace-nowrap text-ts-primary">{interview.date}</span>
            </div>
          </li>
        ))}
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
      bodyClassName="flex flex-col gap-5"
      action={
        <Link href="/employer/billing" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Manage <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col justify-center gap-4 p-0">
        {employerSummary.creditMeters.map((meter) => {
          const pct = Math.min(100, Math.round((meter.used / meter.total) * 100));
          return (
            <li key={meter.label} className="flex flex-col gap-2">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ts-ink">{meter.label}</span>
                <span className={cn("text-[13px] font-bold", pct >= 80 ? "text-ts-accent-deep" : "text-ts-muted")}>
                  {meter.used}/{meter.total}
                </span>
              </span>
              <span
                role="progressbar"
                aria-label={meter.label}
                aria-valuenow={meter.used}
                aria-valuemin={0}
                aria-valuemax={meter.total}
                className="block h-2 overflow-hidden rounded-full bg-ts-surface-2"
              >
                <span className={cn("block h-full rounded-full", pct >= 80 ? "bg-ts-accent" : "bg-ts-primary")} style={{ width: `${pct}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
    </SectionPanel>
  );
}

/** Sourcing: a live search box, the saved searches, and the strongest profiles. */
export function SourcingPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Source candidates"
      description="Search the talent pool or rerun a saved search."
      className={className}
      bodyClassName="flex flex-col gap-4"
      action={
        <Link href="/employer/candidates" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Open search <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <form action={"/employer/candidates" as Route}>
        <label className="sr-only" htmlFor="rail-candidate-search">
          Search candidates
        </label>
        <div className="flex h-12 items-center gap-2.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15">
          <Search size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
          <input
            id="rail-candidate-search"
            name="q"
            type="search"
            placeholder="Skill, title, or location"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {employerSummary.savedSearches.map((saved) => (
          <Link
            key={saved.name}
            href={`/employer/candidates?q=${encodeURIComponent(saved.name)}` as Route}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-ts-surface-2 px-3.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint hover:text-ts-primary-deep"
          >
            {saved.name}
            <span className="text-xs font-bold text-ts-primary">+{saved.fresh}</span>
          </Link>
        ))}
      </div>

      <ul className="m-0 flex flex-1 list-none flex-col gap-2 p-0">
        {employerSummary.candidates.slice(0, 3).map((candidate) => (
          <li key={candidate.name}>
            <Link
              href={`/employer/candidates?q=${encodeURIComponent(candidate.name)}` as Route}
              className="group flex items-center gap-3.5 rounded-ts-md border border-ts-line px-4 py-3 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/30"
            >
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-[13px] font-bold text-ts-primary-deep">
                {initialsOf(candidate.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ts-ink group-hover:text-ts-primary-deep">{candidate.name}</span>
                <span className="block truncate text-[13px] text-ts-muted">
                  {candidate.headline} · {candidate.location}
                </span>
              </span>
              <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-ts-primary-tint px-2.5 text-[13px] font-bold text-ts-primary-deep">{candidate.score}%</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export function EmployerQuickActions({ className }: { className?: string }) {
  return (
    <SectionPanel title="Quick actions" description="Jump straight into the things that need you." className={className}>
      <div className="grid grid-cols-2 gap-4 min-[760px]:grid-cols-3 min-[1560px]:grid-cols-6">
        {quickActions.map(({ icon: Icon, label, detail, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-4 rounded-ts-md border border-ts-line p-4 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-3 min-[1560px]:flex-col min-[1560px]:items-start min-[1560px]:gap-3.5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{label}</span>
              <span className="mt-0.5 block text-[13px] text-ts-muted">{detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </SectionPanel>
  );
}

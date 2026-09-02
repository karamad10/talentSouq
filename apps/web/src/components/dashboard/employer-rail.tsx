import { ArrowUpRight, CalendarDays, Circle, MonitorPlay, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { MeterBar } from "@/components/ui/meter-bar";
import { Tabs } from "@/components/ui/tabs";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { employerSummary } from "@/data/workspace";

export function EmployerRail({ interviewRange }: { interviewRange: "today" | "week" }) {
  const interviews = interviewRange === "today" ? employerSummary.interviewsList.filter((item) => item.date.startsWith("Today")) : employerSummary.interviewsList;

  return (
    <div className="flex flex-col gap-4">
      <SectionPanel title="Today" description="Your hiring team's next actions.">
        <ul className="m-0 flex list-none flex-col p-0">
          {employerSummary.tasks.map((task, index) => (
            <li key={task.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <Link href={task.href} className="group flex items-center gap-2.5 py-2.5">
                <Circle size={14} aria-hidden="true" className="shrink-0 text-ts-field" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ts-ink group-hover:text-ts-primary-deep">{task.title}</span>
                  <span className="block truncate text-xs text-ts-muted">{task.detail}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-ts-muted">{task.when}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel
        title="Interviews"
        action={
          <Tabs
            ariaLabel="Interview range"
            items={[
              { label: "Today", href: "/employer?range=today" as Route, current: interviewRange === "today" },
              { label: "This week", href: "/employer" as Route, current: interviewRange === "week" }
            ]}
          />
        }
      >
        {interviews.length === 0 ? (
          <p className="m-0 py-2 text-[13px] text-ts-muted">Nothing scheduled today.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {interviews.map((interview, index) => (
              <li key={interview.candidate} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="flex items-center gap-2.5 py-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-ts-sm bg-ts-surface-2 text-ts-muted">
                    {interview.mode === "Video" ? <MonitorPlay size={14} aria-hidden="true" /> : <CalendarDays size={14} aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ts-ink">{interview.candidate}</span>
                    <span className="block truncate text-xs text-ts-muted">
                      {interview.role} · {interview.panel}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-ts-primary">{interview.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/employer/interviews" className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
          Open calendar <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </SectionPanel>

      <SectionPanel title="Credit usage" description={`${employerSummary.plan.name} plan · renews ${employerSummary.plan.renewal}`}>
        <div className="flex flex-col gap-3">
          {employerSummary.creditMeters.map((meter) => (
            <MeterBar key={meter.label} label={meter.label} used={meter.used} total={meter.total} />
          ))}
        </div>
        <Link href="/employer/billing" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
          Manage plan <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </SectionPanel>

      <SectionPanel title="Source candidates" description="Search the talent pool or rerun a saved search.">
        <form action={"/employer/candidates" as Route} className="mb-3">
          <label className="sr-only" htmlFor="rail-candidate-search">
            Search candidates
          </label>
          <div className="flex h-9 items-center gap-2 rounded-ts-md border border-ts-field bg-ts-surface px-3 transition-colors focus-within:border-ts-primary">
            <Search size={14} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="rail-candidate-search"
              name="q"
              type="search"
              placeholder="Skill, title, or location"
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
        </form>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {employerSummary.savedSearches.map((saved) => (
            <Link
              key={saved.name}
              href={{ pathname: "/employer/candidates", query: { q: saved.name } } as unknown as Route}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint hover:text-ts-primary-deep"
            >
              {saved.name}
              <span className="text-[11px] font-bold text-ts-primary">+{saved.fresh}</span>
            </Link>
          ))}
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {employerSummary.candidates.slice(0, 2).map((candidate, index) => (
            <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex items-center gap-2.5 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ts-ink">{candidate.name}</span>
                  <span className="block truncate text-xs text-ts-muted">{candidate.headline}</span>
                </span>
                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}%</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </div>
  );
}

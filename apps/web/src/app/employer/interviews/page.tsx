import type { Metadata } from "next";
import { CalendarDays, ClipboardCheck, Clock3, MonitorPlay, UsersRound } from "lucide-react";
import type { Route } from "next";
import { FeedbackDisclosure, JoinMeetingDialog } from "@/components/dashboard/interview-actions";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Interview center" };

type Interview = (typeof employerSummary.interviewsList)[number];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function InterviewRow({ item, past }: { item: Interview; past?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
      <span
        aria-hidden="true"
        className={cn("grid size-11 shrink-0 place-items-center rounded-ts-md", past ? "bg-ts-surface-2 text-ts-muted" : "bg-ts-primary-tint text-ts-primary")}
      >
        {item.mode === "Video" ? <MonitorPlay size={19} /> : <CalendarDays size={19} />}
      </span>
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
        {initialsOf(item.candidate)}
      </span>
      <div className="min-w-50 flex-1">
        <strong className="block truncate text-[15px] font-bold text-ts-ink">{item.candidate}</strong>
        <p className="m-0 mt-1 truncate text-[13px] text-ts-muted">
          {item.role} · {item.stage} · Panel: {item.panel}
        </p>
      </div>
      <span
        className={cn(
          "inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[13px] font-bold whitespace-nowrap",
          past ? "bg-ts-surface-2 text-ts-muted" : "bg-ts-primary-tint text-ts-primary-deep"
        )}
      >
        {item.date}
      </span>
      {item.feedbackDue ? (
        <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-accent-tint px-3 text-[13px] font-bold text-ts-accent-deep">Feedback due</span>
      ) : null}
      <div className="flex shrink-0 items-center gap-2">
        {item.mode === "Video" && !past ? <JoinMeetingDialog candidate={item.candidate} date={item.date} /> : null}
        <FeedbackDisclosure candidate={item.candidate} />
      </div>
    </div>
  );
}

export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = "upcoming" } = await searchParams;
  const upcoming = employerSummary.interviewsList;
  const past = employerSummary.pastInterviews;
  const interviews = range === "today" ? upcoming.filter((item) => item.date.startsWith("Today")) : range === "past" ? past : upcoming;
  const awaitingFeedback = past.filter((item) => item.feedbackDue);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Schedule"
        title="Interview center"
        description="Plan interviews, coordinate panels, launch meeting links, and capture structured feedback."
      />

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Today", value: upcoming.filter((item) => item.date.startsWith("Today")).length, detail: "next at 2:00 PM GST", icon: Clock3, href: "/employer/interviews?range=today" as Route },
          { label: "This week", value: upcoming.length, detail: "across 2 roles", icon: CalendarDays },
          { label: "Awaiting feedback", value: awaitingFeedback.length, detail: "blocking a decision", tone: "attention", icon: ClipboardCheck, href: "/employer/interviews?range=past" as Route },
          { label: "Panel members", value: 4, detail: "involved this week", icon: UsersRound, href: "/employer/team" }
        ]}
      />

      {awaitingFeedback.length > 0 && range !== "past" ? (
        <SectionPanel
          className="mb-6"
          title="Feedback still open"
          description="These interviews happened — the decision is waiting on your notes."
          bodyClassName="p-0"
          action={<span className="text-[13px] font-bold text-ts-accent-deep">{awaitingFeedback.length} pending</span>}
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {awaitingFeedback.map((item, index) => (
              <li key={item.candidate} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <InterviewRow item={item} past />
              </li>
            ))}
          </ul>
        </SectionPanel>
      ) : null}

      <SectionPanel
        title="Schedule"
        description="Times are shown in Gulf Standard Time."
        bodyClassName="p-0"
        action={
          <Tabs
            ariaLabel="Interview range"
            items={[
              { label: "Today", href: "/employer/interviews?range=today" as Route, current: range === "today" },
              { label: "Upcoming", href: "/employer/interviews" as Route, count: upcoming.length, current: range !== "today" && range !== "past" },
              { label: "Past", href: "/employer/interviews?range=past" as Route, count: past.length, current: range === "past" }
            ]}
          />
        }
      >
        {interviews.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={CalendarDays}
              title="Nothing scheduled here"
              description="New sessions appear as soon as they are scheduled."
            />
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {interviews.map((item, index) => (
              <li key={item.candidate} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <InterviewRow item={item} past={range === "past"} />
              </li>
            ))}
          </ul>
        )}
      </SectionPanel>
    </>
  );
}

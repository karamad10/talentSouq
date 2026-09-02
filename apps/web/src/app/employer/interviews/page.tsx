import type { Metadata } from "next";
import { CalendarDays, MonitorPlay } from "lucide-react";
import type { Route } from "next";
import { FeedbackDisclosure, JoinMeetingDialog } from "@/components/dashboard/interview-actions";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Interview center" };

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = "upcoming" } = await searchParams;
  const interviews =
    range === "today" ? employerSummary.interviewsList.filter((item) => item.date.startsWith("Today")) : range === "past" ? [] : employerSummary.interviewsList;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Schedule"
        title="Interview center"
        description="Plan interviews, coordinate panels, launch meeting links, and capture structured feedback."
      />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Today", value: 2 },
          { label: "This week", value: 6 },
          { label: "Awaiting feedback", value: 3 }
        ]}
      />
      <SectionPanel
        title="Schedule"
        action={
          <Tabs
            ariaLabel="Interview range"
            items={[
              { label: "Today", href: "/employer/interviews?range=today" as Route, current: range === "today" },
              { label: "Upcoming", href: "/employer/interviews" as Route, current: range !== "today" && range !== "past" },
              { label: "Past", href: "/employer/interviews?range=past" as Route, current: range === "past" }
            ]}
          />
        }
      >
        {interviews.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={range === "past" ? "No past interviews yet" : "Nothing scheduled here"}
            description={range === "past" ? "Completed interviews and their feedback will be archived here." : "New sessions appear as soon as they are scheduled."}
          />
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {interviews.map((item, index) => (
              <li key={item.candidate} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="flex flex-wrap items-center gap-3 py-3">
                  <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-ts-primary-tint px-2.5 text-xs font-bold text-ts-primary-deep">
                    {item.mode === "Video" ? <MonitorPlay size={13} aria-hidden="true" /> : <CalendarDays size={13} aria-hidden="true" />}
                    {item.date}
                  </span>
                  <Avatar size="sm" initials={initialsOf(item.candidate)} className="bg-ts-primary-tint text-ts-primary-deep" />
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-semibold text-ts-ink">{item.candidate}</strong>
                    <p className="m-0 truncate text-xs text-ts-muted">
                      {item.role} · {item.mode} · Panel: {item.panel}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.mode === "Video" ? <JoinMeetingDialog candidate={item.candidate} date={item.date} /> : null}
                    <FeedbackDisclosure candidate={item.candidate} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionPanel>
    </>
  );
}

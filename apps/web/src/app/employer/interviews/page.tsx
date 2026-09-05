import type { Metadata } from "next";
import { CalendarDays, ClipboardCheck, Clock3, UsersRound } from "lucide-react";
import type { Route } from "next";
import { FeedbackDisclosure } from "@/components/dashboard/interview-actions";
import { InterviewSchedule, panelMembersOf, splitWhen } from "@/components/dashboard/interview-schedule";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCards } from "@/components/ui/metric-cards";
import { Tabs } from "@/components/ui/tabs";
import { PageBody, PanelAction, PersonAvatar, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Interview center" };

export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = "upcoming" } = await searchParams;
  const upcoming = employerSummary.interviewsList;
  const past = employerSummary.pastInterviews;
  const today = upcoming.filter((item) => item.date.startsWith("Today"));
  const interviews = range === "today" ? today : range === "past" ? past : upcoming;
  const awaitingFeedback = past.filter((item) => item.feedbackDue);
  const panelMembers = panelMembersOf([...upcoming, ...past]);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Schedule"
        title="Interview center"
        description="Plan interviews, coordinate panels, launch meeting links, and capture structured feedback."
      />

      <PageBody>
        <MetricCards
          items={[
            { label: "Today", value: today.length, detail: "next at 2:00 PM GST", icon: Clock3, href: "/employer/interviews?range=today" as Route },
            { label: "This week", value: upcoming.length, detail: "across 2 roles", icon: CalendarDays },
            {
              label: "Awaiting feedback",
              value: awaitingFeedback.length,
              detail: "blocking a decision",
              tone: "attention",
              icon: ClipboardCheck,
              href: "/employer/interviews?range=past" as Route
            },
            { label: "Panel members", value: panelMembers.length, detail: "involved this week", icon: UsersRound, href: "/employer/team" }
          ]}
        />

        <SplitLayout
          rail={
            <>
              {awaitingFeedback.length > 0 ? (
                <SectionPanel
                  title="Feedback still open"
                  description="These interviews happened — the decision is waiting on your notes."
                  bodyClassName="p-0"
                  action={<span className="shrink-0 text-[13px] font-bold text-ts-accent-deep">{awaitingFeedback.length} pending</span>}
                >
                  <ul className="m-0 flex list-none flex-col p-0">
                    {awaitingFeedback.map((item, index) => {
                      const { day } = splitWhen(item.date);
                      return (
                        <li
                          key={item.candidate}
                          className={index > 0 ? "flex items-center gap-3 border-t border-ts-line-soft px-5 py-3.5" : "flex items-center gap-3 px-5 py-3.5"}
                        >
                          <PersonAvatar name={item.candidate} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-ts-ink">{item.candidate}</span>
                            <span className="block text-[13px] leading-snug text-ts-muted">
                              {item.stage} · {day}
                            </span>
                          </span>
                          <FeedbackDisclosure candidate={item.candidate} />
                        </li>
                      );
                    })}
                  </ul>
                </SectionPanel>
              ) : null}

              <SectionPanel
                title="Panel"
                description="Everyone interviewing across this cycle."
                bodyClassName="p-0"
                action={<PanelAction href="/employer/team">Team</PanelAction>}
              >
                <ul className="m-0 flex list-none flex-col p-0">
                  {panelMembers.map((member, index) => {
                    const load = [...upcoming, ...past].filter((item) => item.panel.includes(member)).length;
                    return (
                      <li
                        key={member}
                        className={index > 0 ? "flex items-center gap-3 border-t border-ts-line-soft px-5 py-3" : "flex items-center gap-3 px-5 py-3"}
                      >
                        <PersonAvatar name={member} size="sm" />
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ts-ink">{member}</span>
                        <span className="shrink-0 text-[13px] text-ts-muted">
                          {load} {load === 1 ? "session" : "sessions"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </SectionPanel>
            </>
          }
        >
          <SectionPanel
            title="Schedule"
            description="Times are shown in Gulf Standard Time."
            bodyClassName="p-6 max-[680px]:p-4"
            action={
              <Tabs
                ariaLabel="Interview range"
                items={[
                  { label: "Today", href: "/employer/interviews?range=today" as Route, count: today.length, current: range === "today" },
                  { label: "Upcoming", href: "/employer/interviews" as Route, count: upcoming.length, current: range !== "today" && range !== "past" },
                  { label: "Past", href: "/employer/interviews?range=past" as Route, count: past.length, current: range === "past" }
                ]}
              />
            }
          >
            {interviews.length === 0 ? (
              <EmptyState icon={CalendarDays} title="Nothing scheduled here" description="New sessions appear as soon as they are scheduled." />
            ) : (
              <InterviewSchedule interviews={interviews} past={range === "past"} />
            )}
          </SectionPanel>
        </SplitLayout>
      </PageBody>
    </>
  );
}

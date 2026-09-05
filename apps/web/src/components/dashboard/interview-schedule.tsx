import { CalendarDays, MonitorPlay } from "lucide-react";
import { FeedbackDisclosure, JoinMeetingDialog } from "@/components/dashboard/interview-actions";
import { PersonAvatar, SectionLabel } from "@/components/workspace-ui";
import type { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export type Interview = (typeof employerSummary.interviewsList)[number];

/** Dates arrive as "Today · 2:00 PM GST"; the day is what the schedule groups on. */
export function splitWhen(date: string) {
  const [day = date, time = ""] = date.split(" · ");
  return { day, time };
}

export function panelMembersOf(interviews: Interview[]) {
  return [...new Set(interviews.flatMap((item) => item.panel.split(",").map((name) => name.trim())))].filter(Boolean);
}

function InterviewCard({ item, past }: { item: Interview; past?: boolean }) {
  const { time } = splitWhen(item.date);
  const video = item.mode === "Video";

  return (
    <article
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-4 rounded-ts-xl border bg-ts-surface p-4 shadow-ts-card transition-colors",
        past ? "border-ts-line-soft" : "border-ts-line-soft hover:border-ts-primary"
      )}
    >
      <div
        className={cn(
          "flex w-24 shrink-0 flex-col gap-1 border-e pe-4 max-[520px]:w-full max-[520px]:border-e-0 max-[520px]:pe-0",
          past ? "border-ts-line-soft" : "border-ts-line-soft"
        )}
      >
        <strong className={cn("text-sm leading-tight font-bold", past ? "text-ts-muted" : "text-ts-ink")}>{time.replace(" GST", "")}</strong>
        <span className="flex items-center gap-1.5 text-xs text-ts-muted">
          {video ? <MonitorPlay size={12} aria-hidden="true" /> : <CalendarDays size={12} aria-hidden="true" />}
          {item.mode}
        </span>
      </div>

      <div className="flex min-w-50 flex-1 items-center gap-3">
        <PersonAvatar name={item.candidate} />
        <div className="min-w-0">
          <strong className="block truncate text-sm font-bold text-ts-ink">{item.candidate}</strong>
          <p className="m-0 mt-0.5 truncate text-[13px] text-ts-muted">
            {item.role} · {item.stage}
          </p>
          <p className="m-0 mt-0.5 truncate text-xs text-ts-muted">Panel: {item.panel}</p>
        </div>
      </div>

      {item.feedbackDue ? (
        <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-ts-accent-tint px-3 text-xs font-bold text-ts-accent-deep">Feedback due</span>
      ) : null}

      <div className="flex shrink-0 items-center gap-2">
        {video && !past ? <JoinMeetingDialog candidate={item.candidate} date={item.date} /> : null}
        <FeedbackDisclosure candidate={item.candidate} />
      </div>
    </article>
  );
}

/**
 * The schedule, grouped under the day each session falls on. Flat rows made
 * every interview look equally imminent; the day headings put "today" back in
 * charge of the page.
 */
export function InterviewSchedule({ interviews, past }: { interviews: Interview[]; past?: boolean }) {
  const days: { day: string; items: Interview[] }[] = [];
  for (const item of interviews) {
    const { day } = splitWhen(item.date);
    const group = days.find((entry) => entry.day === day);
    if (group) group.items.push(item);
    else days.push({ day, items: [item] });
  }

  return (
    <div className="flex flex-col gap-6">
      {days.map((group) => (
        <section key={group.day} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SectionLabel>{group.day}</SectionLabel>
            <span className="text-xs font-semibold text-ts-muted">
              {group.items.length} {group.items.length === 1 ? "interview" : "interviews"}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-ts-line-soft" />
          </div>
          {group.items.map((item) => (
            <InterviewCard key={item.candidate} item={item} past={past} />
          ))}
        </section>
      ))}
    </div>
  );
}

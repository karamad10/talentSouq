import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { MessageThread } from "@/components/dashboard/message-thread";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer messages" };

export default async function EmployerMessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const { thread } = await searchParams;
  const threads = employerSummary.messageThreads;
  const activeIndex = Math.min(Math.max(Number(thread ?? 0) || 0, 0), threads.length - 1);
  const active = threads[activeIndex];

  return (
    <>
      <WorkspaceHeader
        eyebrow="Inbox"
        title="Candidate messages"
        description="Keep recruiter and candidate conversations connected to the relevant role and application."
      />
      <div className="grid items-stretch gap-4 min-[981px]:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <SectionPanel title="Conversations" bodyClassName="p-2.5">
          <ul className="m-0 flex list-none flex-col p-0">
            {threads.map((item, index) => (
              <li key={item.name}>
                <Link
                  href={`/employer/messages?thread=${index}` as Route}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-ts-md px-2.5 py-2.5 transition-colors",
                    index === activeIndex ? "bg-ts-primary-tint/60" : "hover:bg-ts-surface-2"
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-[11px] font-bold text-ts-primary-deep">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[13px] font-semibold text-ts-ink">{item.name}</strong>
                    <span className="block truncate text-xs text-ts-muted">{item.history[item.history.length - 1]?.text}</span>
                  </span>
                  <small className="shrink-0 text-[11px] text-ts-muted">{item.time}</small>
                </Link>
              </li>
            ))}
          </ul>
        </SectionPanel>
        <SectionPanel title={active.name} description={active.role}>
          <MessageThread key={activeIndex} counterpart={active.name.split(" ")[0]} history={active.history} />
        </SectionPanel>
      </div>
    </>
  );
}

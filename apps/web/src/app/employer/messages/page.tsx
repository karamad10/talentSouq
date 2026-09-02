import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer messages" };

const threads = [
  { name: "Noor Omar", role: "Product Designer", message: "Thursday afternoon works well.", time: "12m" },
  { name: "Rami Farah", role: "Frontend Engineer", message: "I’ve completed the assessment.", time: "1h" },
  { name: "Dina Saleh", role: "Talent search", message: "Thanks for the invitation.", time: "Yesterday" }
];

export default async function EmployerMessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const { thread } = await searchParams;
  const activeIndex = Math.min(Math.max(Number(thread ?? 0) || 0, 0), threads.length - 1);
  const active = threads[activeIndex];

  return (
    <>
      <WorkspaceHeader
        eyebrow="Inbox"
        title="Candidate messages"
        description="Keep recruiter and candidate conversations connected to the relevant role and application."
      />
      <div className="grid items-start gap-4 min-[981px]:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <SectionPanel title="Conversations">
          <ul className="m-0 flex list-none flex-col p-0">
            {threads.map((item, index) => (
              <li key={item.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <Link
                  href={`/employer/messages?thread=${index}` as Route}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-ts-md px-2 py-2.5 transition-colors",
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
                    <span className="block truncate text-xs text-ts-muted">{item.message}</span>
                  </span>
                  <small className="shrink-0 text-[11px] text-ts-muted">{item.time}</small>
                </Link>
              </li>
            ))}
          </ul>
        </SectionPanel>
        <SectionPanel title={active.name} description={active.role}>
          <div className="flex flex-col items-center gap-2 rounded-ts-md border border-dashed border-ts-line px-6 py-10 text-center">
            <MessageSquare size={24} aria-hidden="true" className="text-ts-muted" />
            <strong className="text-sm font-semibold text-ts-ink">{active.message}</strong>
            <p className="m-0 max-w-96 text-[13px] leading-relaxed text-ts-muted">Conversation history, attachments, and recruiter notes will appear here.</p>
            <PreviewActionButton
              type="button"
              className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
              storageKey={`employer-message-reply-${active.name}`}
              pendingLabel="Opening…"
              successLabel="Composer ready"
            >
              Reply
            </PreviewActionButton>
          </div>
        </SectionPanel>
      </div>
    </>
  );
}

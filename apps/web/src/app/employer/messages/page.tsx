import type { Metadata } from "next";
import { MessagesWorkspace } from "@/components/dashboard/messages-workspace";
import { MessagesSeenMarker } from "@/components/shell/messages-seen-marker";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { messagesSeenStorageKey } from "@/lib/notifications";

export const metadata: Metadata = { title: "Employer messages" };

function threadId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default async function EmployerMessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const { thread } = await searchParams;
  const threads = employerSummary.messageThreads.map((item) => ({
    id: threadId(item.name),
    name: item.name,
    meta: item.role,
    time: item.time,
    history: item.history
  }));
  const index = Number(thread);
  const initialThreadId = threads.find((item) => item.id === thread)?.id ?? (Number.isInteger(index) ? threads[index]?.id : undefined);

  return (
    <>
      <MessagesSeenMarker total={threads.length} storageKey={messagesSeenStorageKey("employer")} />
      <WorkspaceHeader
        eyebrow="Inbox"
        title="Candidate messages"
        description="Keep recruiter and candidate conversations connected to the relevant role and application."
      />
      <MessagesWorkspace storagePrefix="talentsouq:employer:thread" initialThreadId={initialThreadId} threads={threads} />
    </>
  );
}

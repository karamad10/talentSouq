import type { Metadata } from "next";
import type { Route } from "next";
import { MessagesWorkspace } from "@/components/dashboard/messages-workspace";
import { ArrowLink } from "@/components/dashboard/section-panel";
import { MessagesSeenMarker } from "@/components/shell/messages-seen-marker";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";
import { messagesSeenStorageKey } from "@/lib/notifications";

export const metadata: Metadata = { title: "Messages" };

/** `?thread=` accepts a thread id (deep links from offers) or a legacy index. */
function resolveThreadId(thread: string | undefined) {
  if (!thread) return undefined;
  const byId = seekerSummary.messages.find((message) => message.id === thread);
  if (byId) return byId.id;
  const index = Number(thread);
  return Number.isInteger(index) ? seekerSummary.messages[index]?.id : undefined;
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const { thread } = await searchParams;

  return (
    <>
      <MessagesSeenMarker total={seekerSummary.messages.length} storageKey={messagesSeenStorageKey("seeker")} />
      <WorkspaceHeader
        eyebrow="Inbox"
        title="Messages"
        description="Conversations with employers and application updates."
        actionSlot={<ArrowLink href={"/seeker/notifications" as Route}>View notifications</ArrowLink>}
      />
      <MessagesWorkspace
        storagePrefix="talentsouq:seeker:thread"
        initialThreadId={resolveThreadId(thread)}
        threads={seekerSummary.messages.map((message) => ({
          id: message.id,
          name: message.from,
          meta: `${message.company} · ${message.role}`,
          time: message.time,
          history: message.history
        }))}
      />
    </>
  );
}

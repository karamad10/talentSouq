"use client";

import { MessageSquare, Paperclip, SendHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { appendSentMessage, loadSentMessages, MESSAGES_UPDATED_EVENT, relativeTime, type StoredMessage } from "@/lib/message-store";
import { cn } from "@/lib/cn";

export type ThreadMessage = { from: "me" | "them"; text: string; when: string };

export type ThreadSeed = {
  id: string;
  name: string;
  /** Secondary line under the name: company, role, or both. */
  meta: string;
  time: string;
  history: ThreadMessage[];
};

function initials(name: string) {
  return name
    .replace(/·.*$/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The full inbox: conversation list, open thread, and a composer that actually
 * persists. Sent messages are stored per device (see `@/lib/message-store`), so
 * they survive a refresh and update the list preview and timestamp too.
 */
export function MessagesWorkspace({
  threads,
  storagePrefix,
  initialThreadId,
  emptyLabel = "No conversations yet."
}: {
  threads: ThreadSeed[];
  storagePrefix: string;
  initialThreadId?: string;
  emptyLabel?: string;
}) {
  const [activeId, setActiveId] = useState(() => initialThreadId ?? threads[0]?.id ?? "");
  const [sent, setSent] = useState<Record<string, StoredMessage[]>>({});
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Read persisted messages after mount so server and client markup match.
  useEffect(() => {
    function load() {
      const next: Record<string, StoredMessage[]> = {};
      for (const thread of threads) next[thread.id] = loadSentMessages(storagePrefix, thread.id);
      setSent(next);
      setHydrated(true);
    }
    const id = window.setTimeout(load, 0);
    window.addEventListener(MESSAGES_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(MESSAGES_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [storagePrefix, threads]);

  const rows = useMemo(
    () =>
      threads.map((thread) => {
        const mine = sent[thread.id] ?? [];
        const messages: ThreadMessage[] = [...thread.history, ...mine.map(({ from, text, ts }) => ({ from, text, when: relativeTime(ts) }))];
        const last = mine[mine.length - 1];
        return {
          ...thread,
          messages,
          preview: messages[messages.length - 1]?.text ?? thread.meta,
          stamp: last ? relativeTime(last.ts) : thread.time,
          awaitingReply: mine.length === 0
        };
      }),
    [threads, sent]
  );

  const active = rows.find((row) => row.id === activeId) ?? rows[0];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    const form = event.currentTarget;
    const text = String(new FormData(form).get("body") ?? "").trim();
    if (!text) return;
    const message = appendSentMessage(storagePrefix, active.id, text);
    // The append dispatches an update event that reloads from storage, so only
    // add it here when that reload has not already picked it up (or storage is
    // unavailable) — otherwise the message would render twice.
    setSent((current) => {
      const existing = current[active.id] ?? [];
      if (existing.some((entry) => entry.ts === message.ts)) return current;
      return { ...current, [active.id]: [...existing, message] };
    });
    form.reset();
  }

  if (!active) {
    return (
      <SectionPanel title="Conversations">
        <p className="m-0 text-sm text-ts-muted">{emptyLabel}</p>
      </SectionPanel>
    );
  }

  return (
    <div className="grid items-stretch gap-6 min-[981px]:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <SectionPanel title="Conversations" description={`${rows.length} threads`} bodyClassName="flex flex-col p-0">
        <ul className="m-0 flex flex-1 list-none flex-col p-0">
          {rows.map((row, index) => (
            <li key={row.id} className={cn("flex", index > 0 && "border-t border-ts-line")}>
              <button
                type="button"
                onClick={() => setActiveId(row.id)}
                aria-current={row.id === active.id ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-3.5 px-5 py-4 text-start transition-colors max-[680px]:px-4",
                  row.id === active.id ? "bg-ts-primary-tint/60" : "hover:bg-ts-surface-2"
                )}
              >
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                  {initials(row.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-ts-ink">{row.name}</span>
                  <span className="block truncate text-[13px] text-ts-muted">{row.preview}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-xs font-semibold text-ts-muted">{row.stamp}</span>
                  {hydrated && row.awaitingReply ? <span aria-label="Awaiting your reply" className="size-2 rounded-full bg-ts-accent" /> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel
        title={active.name}
        description={active.meta}
        bodyClassName="flex min-h-125 flex-col gap-4"
        action={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ts-muted">
            <MessageSquare size={15} aria-hidden="true" /> {active.messages.length} messages
          </span>
        }
      >
        <div ref={listRef} className="flex max-h-150 min-h-0 flex-1 flex-col gap-3 overflow-y-auto pe-1" aria-label={`Conversation with ${active.name}`}>
          {active.messages.map((message, index) => (
            <div
              key={`${index}-${message.when}-${message.text.slice(0, 12)}`}
              className={cn("flex max-w-[78%] flex-col gap-1", message.from === "me" ? "items-end self-end" : "items-start self-start")}
            >
              <p
                className={cn(
                  "m-0 rounded-ts-lg px-4 py-3 text-sm leading-relaxed",
                  message.from === "me" ? "rounded-ee-ts-sm bg-ts-primary text-white" : "rounded-es-ts-sm bg-ts-surface-2 text-ts-ink"
                )}
              >
                {message.text}
              </p>
              <span className="px-1 text-xs text-ts-muted">
                {message.from === "me" ? "You" : active.name.split(" ")[0]} · {message.when}
              </span>
            </div>
          ))}
        </div>

        {/* data-no-pending: opts out of the app-wide submit listener that marks forms
            data-pending="true" (globals.css then shows "Working…" and disables the submit
            button). This form never does a network submission, so that flag would never
            be cleared and the send button would lock up after the first message. */}
        <form onSubmit={send} data-no-pending className="flex items-end gap-3 border-t border-ts-line pt-4">
          <label className="sr-only" htmlFor="thread-composer">
            Reply to {active.name}
          </label>
          <textarea
            id="thread-composer"
            name="body"
            required
            rows={2}
            placeholder={`Reply to ${active.name.split(" ")[0]}… (Enter to send)`}
            className="min-h-12 w-full flex-1 resize-y rounded-ts-md border border-ts-field bg-ts-surface px-4 py-3 text-sm leading-relaxed text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-ts-md border border-ts-line text-ts-muted">
            <Paperclip size={17} />
          </span>
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-ts-md bg-ts-primary px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <SendHorizontal size={16} aria-hidden="true" className="rtl:-scale-x-100" /> Send
          </button>
        </form>
        <p className="m-0 text-xs text-ts-muted">Replies are saved on this device until realtime messaging is connected.</p>
      </SectionPanel>
    </div>
  );
}

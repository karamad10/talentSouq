"use client";

import { SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type ThreadMessage = { from: "me" | "them"; text: string; when: string };

/**
 * Conversation pane with a working composer. Sent messages append locally —
 * the realtime Supabase channel replaces this seam when the backend lands.
 */
export function MessageThread({ counterpart, history }: { counterpart: string; history: ThreadMessage[] }) {
  const [messages, setMessages] = useState(history);
  const listRef = useRef<HTMLDivElement>(null);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("body") ?? "").trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "me", text, when: "Just now" }]);
    form.reset();
    window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }

  return (
    <div className="flex h-full min-h-80 flex-col gap-3">
      <div ref={listRef} className="flex max-h-96 min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pe-1" aria-label={`Conversation with ${counterpart}`}>
        {messages.map((message, index) => (
          <div key={`${index}-${message.when}`} className={cn("flex max-w-[85%] flex-col gap-0.5", message.from === "me" ? "items-end self-end" : "items-start self-start")}>
            <p
              className={cn(
                "m-0 rounded-ts-md px-3.5 py-2.5 text-[13px] leading-relaxed",
                message.from === "me" ? "rounded-ee-ts-sm bg-ts-primary text-white" : "rounded-es-ts-sm bg-ts-surface-2 text-ts-ink"
              )}
            >
              {message.text}
            </p>
            <span className="px-1 text-[11px] text-ts-muted">
              {message.from === "me" ? "You" : counterpart} · {message.when}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex items-end gap-2 border-t border-ts-line pt-3">
        <label className="sr-only" htmlFor="thread-composer">
          Reply to {counterpart}
        </label>
        <textarea
          id="thread-composer"
          name="body"
          required
          rows={2}
          placeholder={`Reply to ${counterpart}…`}
          className="min-h-10 w-full flex-1 resize-y rounded-ts-md border border-ts-field bg-ts-surface px-3 py-2 text-[13px] leading-relaxed text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-10 shrink-0 rounded-ts-md px-4 text-[13px]")}>
          <SendHorizontal size={14} aria-hidden="true" className="rtl:-scale-x-100" /> Send
        </button>
      </form>
      <p className="m-0 text-[11px] text-ts-muted">Preview: replies stay on this device until realtime messaging is connected.</p>
    </div>
  );
}

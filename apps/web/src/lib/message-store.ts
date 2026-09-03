/**
 * Per-device message persistence for the preview build. Seeded conversations
 * live in `@/data/workspace`; anything the user sends is appended here so it
 * survives a refresh and shows up in the conversation list, not just in the
 * open pane. Swap the four functions below for Supabase calls when the
 * realtime backend lands — nothing else needs to change.
 */

export type StoredMessage = { from: "me" | "them"; text: string; when: string; ts: number };

export const MESSAGES_UPDATED_EVENT = "ts-messages-updated";

function key(prefix: string, threadId: string) {
  return `${prefix}:${threadId}`;
}

export function loadSentMessages(prefix: string, threadId: string): StoredMessage[] {
  try {
    const raw = window.localStorage.getItem(key(prefix, threadId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is StoredMessage => {
      const candidate = entry as Partial<StoredMessage>;
      return typeof candidate?.text === "string" && (candidate.from === "me" || candidate.from === "them");
    });
  } catch {
    return [];
  }
}

export function appendSentMessage(prefix: string, threadId: string, text: string): StoredMessage {
  const message: StoredMessage = { from: "me", text, when: "Just now", ts: Date.now() };
  try {
    const next = [...loadSentMessages(prefix, threadId), message];
    window.localStorage.setItem(key(prefix, threadId), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(MESSAGES_UPDATED_EVENT));
  } catch {
    // Preview state only; the message still shows for this session.
  }
  return message;
}

export function clearThread(prefix: string, threadId: string) {
  try {
    window.localStorage.removeItem(key(prefix, threadId));
    window.dispatchEvent(new CustomEvent(MESSAGES_UPDATED_EVENT));
  } catch {
    // Ignore storage failures.
  }
}

/** "Just now" for anything under a minute, then a compact relative label. */
export function relativeTime(ts: number, now = Date.now()): string {
  const minutes = Math.floor((now - ts) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d`;
}

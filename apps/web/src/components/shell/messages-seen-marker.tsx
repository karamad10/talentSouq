"use client";

import { useEffect } from "react";
import { MESSAGES_SEEN_EVENT } from "@/lib/notifications";

/** Invisible: marks every conversation as seen on this device when the messages page mounts. */
export function MessagesSeenMarker({ total, storageKey }: { total: number; storageKey: string }) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, String(total));
      } catch {
        // Preview state only; ignore storage failures.
      }
      window.dispatchEvent(new CustomEvent(MESSAGES_SEEN_EVENT));
    }, 0);
    return () => window.clearTimeout(id);
  }, [total, storageKey]);

  return null;
}

"use client";

import { MessageSquare } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MESSAGES_SEEN_EVENT } from "@/lib/notifications";

/**
 * App-bar message icon with a live unread count: `total` conversations minus
 * how many this device has already opened (marked by the messages pages).
 * Mirrors NotificationBell so the two badges stay consistent.
 */
export function MessagesBell({ href, total, storageKey }: { href: Route; total: number; storageKey: string }) {
  const [unseen, setUnseen] = useState(total);

  useEffect(() => {
    function compute() {
      let seen = 0;
      try {
        seen = Number(window.localStorage.getItem(storageKey) ?? 0) || 0;
      } catch {
        seen = 0;
      }
      setUnseen(Math.max(0, total - seen));
    }
    const id = window.setTimeout(compute, 0);
    window.addEventListener(MESSAGES_SEEN_EVENT, compute);
    window.addEventListener("storage", compute);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(MESSAGES_SEEN_EVENT, compute);
      window.removeEventListener("storage", compute);
    };
  }, [storageKey, total]);

  const showBadge = unseen > 0;

  return (
    <Link
      href={href}
      aria-label={showBadge ? `Messages, ${unseen} unread` : "Messages"}
      className="relative inline-flex size-10 items-center justify-center rounded-ts-md text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
    >
      <MessageSquare size={19} aria-hidden="true" />
      {showBadge ? (
        <span
          aria-hidden="true"
          className="absolute end-1 top-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-ts-danger px-1 text-[10px] leading-none font-bold text-white"
        >
          {unseen}
        </span>
      ) : null}
    </Link>
  );
}

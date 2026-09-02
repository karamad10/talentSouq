"use client";

import { Bell } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NOTIFICATIONS_SEEN_EVENT } from "@/lib/notifications";

/**
 * App-bar bell with a live unread count: `total` notifications minus how many
 * this device has already seen (stored by the notifications page).
 */
export function NotificationBell({ href, total, storageKey }: { href: Route; total: number; storageKey: string }) {
  const [unseen, setUnseen] = useState<number | null>(null);

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
    window.addEventListener(NOTIFICATIONS_SEEN_EVENT, compute);
    window.addEventListener("storage", compute);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(NOTIFICATIONS_SEEN_EVENT, compute);
      window.removeEventListener("storage", compute);
    };
  }, [storageKey, total]);

  const showBadge = (unseen ?? 0) > 0;

  return (
    <Link
      href={href}
      aria-label={showBadge ? `Notifications, ${unseen} unread` : "Notifications"}
      className="relative inline-flex size-8 items-center justify-center rounded-ts-sm text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
    >
      <Bell size={17} aria-hidden="true" />
      {showBadge ? (
        <span
          aria-hidden="true"
          className="absolute -end-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ts-danger px-1 text-[10px] leading-none font-bold text-white"
        >
          {unseen}
        </span>
      ) : null}
    </Link>
  );
}

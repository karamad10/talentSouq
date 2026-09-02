"use client";

import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATIONS_SEEN_EVENT } from "@/lib/notifications";
import { cn } from "@/lib/cn";

export type NotificationRow = { title: string; meta: string };

/**
 * Notification feed with per-device read state: anything newer than the last
 * visit renders as unread, and opening the page marks everything seen (which
 * also clears the app-bar bell badge).
 */
export function NotificationList({ items, storageKey }: { items: NotificationRow[]; storageKey: string }) {
  const [unreadCount, setUnreadCount] = useState<number>(items.length);

  useEffect(() => {
    const id = window.setTimeout(() => {
      let seen = 0;
      try {
        seen = Number(window.localStorage.getItem(storageKey) ?? 0) || 0;
      } catch {
        seen = 0;
      }
      setUnreadCount(Math.max(0, items.length - seen));
      try {
        window.localStorage.setItem(storageKey, String(items.length));
      } catch {
        // Preview state only; ignore storage failures.
      }
      window.dispatchEvent(new CustomEvent(NOTIFICATIONS_SEEN_EVENT));
    }, 0);
    return () => window.clearTimeout(id);
  }, [items.length, storageKey]);

  return (
    <ul className="m-0 flex list-none flex-col overflow-hidden rounded-ts-lg border border-ts-line bg-ts-surface p-0">
      {items.map((item, index) => {
        const unread = index < unreadCount;
        return (
          <li key={item.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
            <div className={cn("flex items-center gap-3 px-4 py-3.5", unread && "bg-ts-primary-tint/30")}>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-ts-sm",
                  unread ? "bg-ts-primary-tint text-ts-primary" : "bg-ts-surface-2 text-ts-muted"
                )}
              >
                <BellRing size={15} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("m-0 truncate text-sm text-ts-ink", unread ? "font-bold" : "font-medium")}>{item.title}</p>
                <p className="m-0 text-xs text-ts-muted">{item.meta}</p>
              </div>
              {unread ? (
                <Badge tone="brand" size="sm">
                  New
                </Badge>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

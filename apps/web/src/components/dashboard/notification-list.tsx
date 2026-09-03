"use client";

import { ArrowUpRight, BellRing, BriefcaseBusiness, CalendarDays, CheckCheck, MessageSquare, Search, Sparkles, Trophy, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NOTIFICATIONS_SEEN_EVENT } from "@/lib/notifications";
import { cn } from "@/lib/cn";

export type NotificationKind = "application" | "message" | "alert" | "profile" | "interview" | "offer" | "system";

export type NotificationRow = {
  title: string;
  meta: string;
  id?: string;
  kind?: NotificationKind;
  time?: string;
  group?: string;
  href?: string;
};

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  application: BriefcaseBusiness,
  message: MessageSquare,
  alert: Search,
  profile: UserRound,
  interview: CalendarDays,
  offer: Trophy,
  system: Sparkles
};

const KIND_LABEL: Record<NotificationKind, string> = {
  application: "Applications",
  message: "Messages",
  alert: "Job alerts",
  profile: "Profile",
  interview: "Interviews",
  offer: "Offers",
  system: "TalentSouq"
};

const KIND_TONE: Record<NotificationKind, string> = {
  application: "bg-ts-slate-tint text-ts-muted",
  message: "bg-ts-primary-tint text-ts-primary",
  alert: "bg-ts-primary-tint text-ts-primary",
  profile: "bg-ts-slate-tint text-ts-muted",
  interview: "bg-ts-accent-tint text-ts-accent-deep",
  offer: "bg-ts-success-tint text-ts-success",
  system: "bg-ts-slate-tint text-ts-muted"
};

/**
 * Notification feed with per-device read state and kind filtering. Anything
 * newer than the last visit renders as unread; opening the page marks
 * everything seen, which also clears the app-bar bell badge.
 */
export function NotificationList({ items, storageKey }: { items: NotificationRow[]; storageKey: string }) {
  const [unreadCount, setUnreadCount] = useState<number>(items.length);
  const [filter, setFilter] = useState<"all" | NotificationKind>("all");

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

  const kinds = useMemo(() => {
    const counts = new Map<NotificationKind, number>();
    for (const item of items) {
      const kind = item.kind ?? "system";
      counts.set(kind, (counts.get(kind) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [items]);

  const rows = items.map((item, index) => ({ ...item, unread: index < unreadCount }));
  const filtered = filter === "all" ? rows : rows.filter((row) => (row.kind ?? "system") === filter);
  const groups = filtered.reduce<Record<string, typeof filtered>>((acc, row) => {
    const group = row.group ?? "Recent";
    (acc[group] ??= []).push(row);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={items.length} />
        {kinds.map(([kind, count]) => (
          <FilterChip key={kind} active={filter === kind} onClick={() => setFilter(kind)} label={KIND_LABEL[kind]} count={count} />
        ))}
        <span className="ms-auto inline-flex items-center gap-2 text-[13px] font-semibold text-ts-muted">
          <CheckCheck size={15} aria-hidden="true" />
          {unreadCount > 0 ? `${unreadCount} new since your last visit` : "You’re all caught up"}
        </span>
      </div>

      {Object.entries(groups).map(([group, groupRows]) => (
        <section key={group} className="flex flex-col gap-2.5">
          <h2 className="m-0 text-xs font-bold tracking-[0.08em] text-ts-muted uppercase">{group}</h2>
          <ul className="m-0 flex list-none flex-col overflow-hidden rounded-ts-lg border border-ts-line bg-ts-surface p-0">
            {groupRows.map((row, index) => {
              const kind = row.kind ?? "system";
              const Icon = KIND_ICON[kind] ?? BellRing;
              const body = (
                <>
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-ts-md", KIND_TONE[kind])}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[15px] text-ts-ink", row.unread ? "font-bold" : "font-semibold")}>{row.title}</span>
                    <span className="mt-1 block text-[13px] text-ts-muted">{row.meta}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    {row.time ? <span className="text-[13px] whitespace-nowrap text-ts-muted">{row.time}</span> : null}
                    {row.unread ? <span aria-label="Unread" className="size-2.5 rounded-full bg-ts-accent" /> : null}
                    {row.href ? <ArrowUpRight size={16} aria-hidden="true" className="text-ts-muted rtl:-scale-x-100" /> : null}
                  </span>
                </>
              );
              const className = cn(
                "flex w-full items-center gap-4 px-6 py-4 text-start max-[680px]:px-4",
                row.unread && "bg-ts-primary-tint/25",
                row.href && "transition-colors hover:bg-ts-primary-tint/50"
              );
              return (
                <li key={row.id ?? row.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  {row.href ? (
                    <Link href={row.href as never} className={className}>
                      {body}
                    </Link>
                  ) : (
                    <div className={className}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {filtered.length === 0 ? (
        <p className="m-0 rounded-ts-lg border border-dashed border-ts-line px-6 py-10 text-center text-sm text-ts-muted">
          Nothing in this category yet.
        </p>
      ) : null}
    </div>
  );
}

function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
        active ? "bg-ts-primary-tint text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
      )}
    >
      {label}
      <span className={cn("inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold", active ? "bg-ts-surface text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted")}>
        {count}
      </span>
    </button>
  );
}

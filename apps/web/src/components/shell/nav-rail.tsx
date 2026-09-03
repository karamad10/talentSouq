"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DevWorkspaceSwitcher } from "@/components/dev-workspace-switcher";
import { navGroups, workspaceUnread, type WorkspaceRole } from "@/components/shell/nav-config";
import { cn } from "@/lib/cn";
import { MESSAGES_SEEN_EVENT, messagesSeenStorageKey } from "@/lib/notifications";

function useUnseenMessages(active: WorkspaceRole) {
  const total = workspaceUnread[active].messages;
  const storageKey = messagesSeenStorageKey(active);
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

  return unseen;
}

/**
 * The workspace navigation, rendered once: a 220px vertical rail from 981px up,
 * a horizontal scrolling chip bar below that. One element keeps the
 * `aria-label="<role> workspace"` contract unique on every viewport.
 */
export function WorkspaceNav({ active }: { active: WorkspaceRole }) {
  const pathname = usePathname();
  const unseenMessages = useUnseenMessages(active);
  const messagesHref = workspaceUnread[active].messagesHref;

  return (
    <nav
      aria-label={`${active} workspace`}
      className={cn(
        "sticky top-16 z-20 flex gap-2 overflow-x-auto border-b border-ts-line bg-ts-surface px-4 py-2.5",
        "min-[981px]:sticky min-[981px]:top-16 min-[981px]:z-auto min-[981px]:h-[calc(100vh-4rem)] min-[981px]:w-64 min-[981px]:shrink-0 min-[981px]:flex-col min-[981px]:gap-7",
        "min-[981px]:overflow-x-hidden min-[981px]:overflow-y-auto min-[981px]:border-e min-[981px]:border-b-0 min-[981px]:bg-ts-surface-2/40 min-[981px]:px-4 min-[981px]:py-6"
      )}
    >
      {navGroups[active].map((group) => (
        <div key={group.label} className="contents min-[981px]:flex min-[981px]:flex-col min-[981px]:gap-1">
          <span className="hidden px-3 pb-1 text-[11px] font-bold tracking-[0.08em] text-ts-subtle uppercase min-[981px]:block">{group.label}</span>
          {group.items.map((item) => {
            const Icon = item.icon;
            const current = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const count = item.href === messagesHref ? unseenMessages : item.count;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                  "min-[981px]:flex min-[981px]:h-11 min-[981px]:shrink min-[981px]:gap-3 min-[981px]:rounded-ts-md min-[981px]:px-3 min-[981px]:whitespace-normal",
                  current ? "bg-ts-primary-tint font-semibold text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
                )}
              >
                <Icon size={18} aria-hidden="true" className={cn("shrink-0", current ? "text-ts-primary" : "text-ts-subtle")} />
                <span className="min-w-0 min-[981px]:truncate">{item.label}</span>
                {typeof count === "number" && count > 0 ? (
                  <span
                    className={cn(
                      "inline-flex h-5.5 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold min-[981px]:ms-auto",
                      current ? "bg-ts-surface text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
      <div className="mt-auto hidden pt-4 min-[981px]:block">
        <DevWorkspaceSwitcher />
      </div>
    </nav>
  );
}

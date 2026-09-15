import { Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { workspaceIdentity, workspaceSearch, workspaceUnread, type WorkspaceRole } from "@/components/shell/nav-config";
import { MessagesBell } from "@/components/shell/messages-bell";
import { NotificationBell } from "@/components/shell/notification-bell";
import { messagesSeenStorageKey, seenStorageKey } from "@/lib/notifications";
import { WorkspaceChip } from "@/components/shell/workspace-chip";

/**
 * The workspace app bar.
 *
 * Its contents are ordered by how little room they can survive in: brand,
 * identity, unread bells. Everything is `shrink`-able or hidden at a stated
 * width, because the bar has no horizontal scroll to fall back on — anything
 * that overflows here is simply unreachable.
 *
 * Below 981px the profile link folds into the identity chip's menu (it opens
 * the same page) and the search field gives way to the search pages reachable
 * from the bottom tab bar, which have their own full-width fields.
 */
export function AppBar({ active }: { active: WorkspaceRole }) {
  const identity = workspaceIdentity[active];
  const search = workspaceSearch[active];
  const unread = workspaceUnread[active];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-ts-line bg-ts-surface">
      <div className="flex h-full w-full items-center gap-2 px-5 max-[980px]:gap-2.5 max-[680px]:px-4">
        <Logo compact="wide" />
        <WorkspaceChip identity={identity} />

        <div className="min-w-0 flex-1" />

        <form action={search.action} className="hidden w-full max-w-[540px] min-w-0 shrink min-[981px]:block" role="search">
          <label className="sr-only" htmlFor="workspace-search">
            {search.label}
          </label>
          <div className="flex h-11 items-center gap-2.5 rounded-full border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary-tint">
            <Search size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="workspace-search"
              name="q"
              type="search"
              placeholder={search.placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
        </form>

        <div className="min-w-0 flex-1" />

        <div className="flex shrink-0 items-center gap-0.5 min-[981px]:gap-1">
          <NotificationBell href={unread.notificationsHref} total={unread.notifications} storageKey={seenStorageKey(active)} />
          <MessagesBell href={unread.messagesHref} total={unread.messages} storageKey={messagesSeenStorageKey(active)} />
          <Link
            href={identity.href}
            aria-label={`${identity.name} — ${identity.eyebrow}`}
            className="ms-1.5 hidden size-10 place-items-center rounded-full bg-ts-primary text-xs font-bold text-white transition-opacity hover:opacity-90 min-[981px]:grid"
          >
            <span aria-hidden="true">{identity.initials}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

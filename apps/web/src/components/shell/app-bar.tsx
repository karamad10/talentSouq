import { Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { workspaceIdentity, workspaceSearch, workspaceUnread, type WorkspaceRole } from "@/components/shell/nav-config";
import { MessagesBell } from "@/components/shell/messages-bell";
import { NotificationBell } from "@/components/shell/notification-bell";
import { messagesSeenStorageKey, seenStorageKey } from "@/lib/notifications";
import { WorkspaceChip } from "@/components/shell/workspace-chip";

export function AppBar({ active }: { active: WorkspaceRole }) {
  const identity = workspaceIdentity[active];
  const search = workspaceSearch[active];
  const unread = workspaceUnread[active];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-ts-line bg-ts-surface">
      <div className="flex h-full w-full items-center gap-4 px-5 max-[680px]:px-4">
        <Logo />
        <WorkspaceChip identity={identity} />
        <div className="min-w-0 flex-1" />
        <form action={search.action} className="hidden w-[540px] min-w-0 md:block" role="search">
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
        <div className="flex items-center gap-1">
          <NotificationBell href={unread.notificationsHref} total={unread.notifications} storageKey={seenStorageKey(active)} />
          <MessagesBell href={unread.messagesHref} total={unread.messages} storageKey={messagesSeenStorageKey(active)} />
          <Link
            href={identity.href}
            aria-label={`${identity.name} — ${identity.eyebrow}`}
            className="ms-1.5 grid size-10 place-items-center rounded-full bg-ts-primary text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">{identity.initials}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

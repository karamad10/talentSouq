import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { workspaceIdentity, workspaceSearch, workspaceUnread, type WorkspaceRole } from "@/components/shell/nav-config";
import { NotificationBell } from "@/components/shell/notification-bell";
import { seenStorageKey } from "@/lib/notifications";
import { WorkspaceChip } from "@/components/shell/workspace-chip";

export function AppBar({ active }: { active: WorkspaceRole }) {
  const identity = workspaceIdentity[active];
  const search = workspaceSearch[active];
  const unread = workspaceUnread[active];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-ts-line bg-ts-surface">
      <div className="mx-auto flex h-full w-full max-w-360 items-center gap-3 px-4">
        <Logo />
        <WorkspaceChip identity={identity} />
        <div className="min-w-0 flex-1" />
        <form action={search.action} className="hidden w-[420px] min-w-0 md:block" role="search">
          <label className="sr-only" htmlFor="workspace-search">
            {search.label}
          </label>
          <div className="flex h-9 items-center gap-2 rounded-full border border-ts-field bg-ts-surface px-3.5 transition-colors focus-within:border-ts-primary">
            <Search size={15} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="workspace-search"
              name="q"
              type="search"
              placeholder={search.placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
        </form>
        <div className="min-w-0 flex-1" />
        <div className="flex items-center gap-1.5">
          <NotificationBell href={unread.notificationsHref} total={unread.notifications} storageKey={seenStorageKey(active)} />
          <Link
            href={unread.messagesHref}
            aria-label={`Messages, ${unread.messages} unread`}
            className="relative inline-flex size-8 items-center justify-center rounded-ts-sm text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
          >
            <MessageSquare size={17} aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -end-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ts-danger px-1 text-[10px] font-bold leading-none text-white"
            >
              {unread.messages}
            </span>
          </Link>
          <Link
            href={identity.href}
            aria-label={`${identity.name} — ${identity.eyebrow}`}
            className="ms-1 grid size-8 place-items-center rounded-full bg-ts-primary text-[11px] font-bold text-white transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">{identity.initials}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

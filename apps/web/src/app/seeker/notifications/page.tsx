import type { Metadata } from "next";
import { BellRing, MessageSquare, Search, Settings2 } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { ToggleActionButton } from "@/components/interaction-ui";
import { MetricCards } from "@/components/ui/metric-cards";
import { seenStorageKey } from "@/lib/notifications";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Notifications", description: "Application updates, saved-search alerts, and profile activity." };

const channels = [
  { name: "Application status changes", detail: "Stage moves, rejections, and offers", key: "status" },
  { name: "New messages", detail: "Recruiter replies and interview requests", key: "messages" },
  { name: "Saved search alerts", detail: "Fresh roles matching your alerts", key: "alerts" },
  { name: "Profile activity", detail: "Views, follows, and CV parsing", key: "profile" },
  { name: "Weekly match digest", detail: "Every Sunday morning", key: "digest" }
];

export default function SeekerNotificationsPage() {
  const items = seekerSummary.notifications;
  const today = items.filter((item) => item.group === "Today").length;
  const messages = items.filter((item) => item.kind === "message").length;
  const alerts = items.filter((item) => item.kind === "alert").length;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Personal workspace"
        title="Notifications"
        description="Everything that moved on your search — applications, messages, alerts, and profile activity, newest first."
      />
      <MetricCards
        className="mb-6"
        items={[
          { label: "New today", value: today, detail: "since yesterday", icon: BellRing },
          { label: "Message alerts", value: messages, detail: "waiting on a reply", icon: MessageSquare, href: "/seeker/messages" },
          { label: "Saved search hits", value: alerts, detail: "across 3 alerts", icon: Search, href: "/seeker/saved" },
          { label: "Total this week", value: items.length, detail: "all categories", icon: Settings2 }
        ]}
      />
      <NotificationList items={items} storageKey={seenStorageKey("seeker")} />
      <SectionPanel
        className="mt-6"
        title="What you get notified about"
        description="Turn a category off and it stops appearing in this feed and in the bell."
        bodyClassName="p-0"
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {channels.map((channel, index) => (
            <li key={channel.key} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
              <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ts-ink">{channel.name}</span>
                  <span className="block text-[13px] text-ts-muted">{channel.detail}</span>
                </span>
                <ToggleActionButton
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ts-field bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2 aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
                  label="On"
                  activeLabel="Muted"
                  storageKey={`seeker-notify-${channel.key}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </>
  );
}

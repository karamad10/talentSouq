import type { Metadata } from "next";
import { CheckCheck } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Notifications", description: "Application updates, saved-search alerts, and profile activity." };

export default function SeekerNotificationsPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Personal workspace"
        title="Notifications"
        description="Application updates, saved-search alerts, and profile activity — newest first."
      />
      <NotificationList items={seekerSummary.notifications} />
      <p className="mt-4 flex items-center gap-2 text-xs text-ts-muted">
        <CheckCheck size={14} aria-hidden="true" />
        You&rsquo;re all caught up.
      </p>
    </>
  );
}

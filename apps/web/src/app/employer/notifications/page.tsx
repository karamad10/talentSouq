import type { Metadata } from "next";
import { CheckCheck } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { seenStorageKey } from "@/lib/notifications";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Notifications", description: "Hiring activity across your jobs, applicants, and team." };

export default function EmployerNotificationsPage() {
  const items = employerSummary.tasks.map((task) => ({ title: task.title, meta: `${task.detail} · ${task.when}` }));
  return (
    <>
      <WorkspaceHeader
        eyebrow="Company workspace"
        title="Notifications"
        description="Hiring activity across your jobs, applicants, and team — newest first."
      />
      <NotificationList items={items} storageKey={seenStorageKey("employer")} />
      <p className="mt-4 flex items-center gap-2 text-xs text-ts-muted">
        <CheckCheck size={14} aria-hidden="true" />
        You&rsquo;re all caught up.
      </p>
    </>
  );
}

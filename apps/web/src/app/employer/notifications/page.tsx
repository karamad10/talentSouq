import type { Metadata } from "next";
import { BellRing, MessageSquare, UsersRound } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { seenStorageKey } from "@/lib/notifications";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Notifications", description: "Hiring activity across your jobs, applicants, and team." };

export default function EmployerNotificationsPage() {
  const items = employerSummary.notifications;
  const today = items.filter((item) => item.group === "Today").length;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Company workspace"
        title="Notifications"
        description="Hiring activity across your jobs, applicants, and team — newest first."
      />
      <KpiStrip
        className="mb-6"
        items={[
          { label: "New today", value: today, detail: "since yesterday", icon: BellRing },
          { label: "Candidate replies", value: items.filter((item) => item.kind === "message").length, detail: "waiting on you", icon: MessageSquare, href: "/employer/messages" },
          { label: "Applicants to review", value: employerSummary.newApplicants, detail: "across 2 live roles", icon: UsersRound, href: "/employer/pipeline" }
        ]}
      />
      <NotificationList items={items} storageKey={seenStorageKey("employer")} />
    </>
  );
}

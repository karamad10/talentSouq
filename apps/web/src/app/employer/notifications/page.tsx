import type { Metadata } from "next";
import { BellRing, MessageSquare, UsersRound } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { MetricCards } from "@/components/ui/metric-cards";
import { seenStorageKey } from "@/lib/notifications";
import { MiniMeter, PageBody, PanelAction, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Notifications", description: "Hiring activity across your jobs, applicants, and team." };

const KIND_LABEL: Record<string, string> = {
  application: "Applications",
  message: "Messages",
  alert: "Job alerts",
  profile: "Profile",
  interview: "Interviews",
  offer: "Offers",
  system: "TalentSouq"
};

export default function EmployerNotificationsPage() {
  const items = employerSummary.notifications;
  const today = items.filter((item) => item.group === "Today").length;
  const byKind = [...items.reduce((acc, item) => acc.set(item.kind, (acc.get(item.kind) ?? 0) + 1), new Map<string, number>())].sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      <WorkspaceHeader
        eyebrow="Company workspace"
        title="Notifications"
        description="Hiring activity across your jobs, applicants, and team — newest first."
      />

      <PageBody>
        <MetricCards
          items={[
            { label: "New today", value: today, detail: "since yesterday", icon: BellRing },
            {
              label: "Candidate replies",
              value: items.filter((item) => item.kind === "message").length,
              detail: "waiting on you",
              icon: MessageSquare,
              href: "/employer/messages"
            },
            { label: "Applicants to review", value: employerSummary.newApplicants, detail: "across 2 live roles", icon: UsersRound, href: "/employer/pipeline" }
          ]}
        />

        <SplitLayout
          rail={
            <SectionPanel
              title="Activity by type"
              description="What has been driving your notifications."
              bodyClassName="flex flex-col gap-3.5"
              flush
              action={<PanelAction href="/employer/messages">Inbox</PanelAction>}
            >
              {byKind.map(([kind, count]) => (
                <MiniMeter
                  key={kind}
                  label={KIND_LABEL[kind] ?? kind}
                  value={count}
                  max={items.length}
                  caption={`${count}`}
                  ariaLabel={`${KIND_LABEL[kind] ?? kind}: ${count} notifications`}
                />
              ))}
            </SectionPanel>
          }
        >
          <NotificationList items={items} storageKey={seenStorageKey("employer")} />
        </SplitLayout>
      </PageBody>
    </>
  );
}

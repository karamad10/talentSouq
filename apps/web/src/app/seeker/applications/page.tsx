import type { Metadata } from "next";
import type { Route } from "next";
import { ApplicationsTable } from "@/components/dashboard/application-tracker";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { MetricCards } from "@/components/ui/metric-cards";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Applications", description: "Track Easy Apply and external applications." };

const viewTabs = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy Apply" },
  { key: "external", label: "External" },
  { key: "interviews", label: "Interviews" }
] as const;

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "all" } = await searchParams;
  const easyApplies = seekerSummary.applications.length - seekerSummary.externalApplications;
  const rows =
    view === "easy"
      ? seekerSummary.applications.slice(0, easyApplies)
      : view === "external"
        ? seekerSummary.applications.slice(-seekerSummary.externalApplications)
        : view === "interviews"
          ? seekerSummary.applications.filter((item) => item.stage === "Interview")
          : seekerSummary.applications;

  return (
    <>
      <WorkspaceHeader eyebrow="Tracking" title="Applications" description="Track Easy Apply, external applications, employer activity, and next steps." />
      <MetricCards
        className="mb-4"
        items={seekerSummary.applicationViews.map((item) => ({ label: item.label, value: item.count }))}
      />
      <SectionPanel title="Application tracker" description="Select an application to open messages, the posting, or withdrawal controls.">
        <div className="flex flex-col gap-3">
          <Tabs
            ariaLabel="Filter applications"
            items={viewTabs.map((tab) => ({
              label: tab.label,
              href: (tab.key === "all" ? "/seeker/applications" : `/seeker/applications?view=${tab.key}`) as Route,
              current: view === tab.key
            }))}
          />
          <ApplicationsTable rows={rows} />
        </div>
      </SectionPanel>
    </>
  );
}

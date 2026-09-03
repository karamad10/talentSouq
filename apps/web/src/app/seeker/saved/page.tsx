import type { Metadata } from "next";
import { Bell, Bookmark, Search } from "lucide-react";
import { JobRows } from "@/components/dashboard/job-list";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { ToggleActionButton } from "@/components/interaction-ui";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Saved jobs and alerts" };

export default function SavedPage() {
  const freshTotal = seekerSummary.savedSearches.reduce((sum, search) => sum + Number(search.trend.replace(/\D/g, "")), 0);
  const trackedRoles = seekerSummary.savedSearches.reduce((sum, search) => sum + search.count, 0);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Library"
        title="Saved jobs & alerts"
        description="Return to bookmarked roles and manage the searches that notify you about new matches."
      />

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Saved jobs", value: seekerSummary.savedJobs, detail: "bookmarked roles", icon: Bookmark },
          { label: "Saved searches", value: seekerSummary.savedSearches.length, detail: "alerts running", icon: Bell },
          { label: "Fresh matches", value: freshTotal, detail: "since you last looked", tone: "success", icon: Search, href: "/seeker/jobs" },
          { label: "Roles tracked", value: trackedRoles, detail: "across your alerts", icon: Search }
        ]}
      />

      <SectionPanel title="Saved searches" description="Alert frequency and fresh-result counts." bodyClassName="p-0">
        <ul className="m-0 flex list-none flex-col p-0">
          {seekerSummary.savedSearches.map((item, index) => (
            <li key={item.name} className={cn("flex", index > 0 && "border-t border-ts-line")}>
              <div className="flex w-full flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-slate-tint text-ts-subtle">
                  <Bell size={18} />
                </span>
                <div className="min-w-40 flex-1">
                  <strong className="block truncate text-[15px] font-bold text-ts-ink">{item.name}</strong>
                  <p className="m-0 mt-1 text-[13px] text-ts-muted">{item.count} roles tracked</p>
                </div>
                <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-bold text-ts-primary-deep">{item.trend}</span>
                <ToggleActionButton
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ts-field bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2 aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
                  label="Weekly alerts on"
                  activeLabel="Alerts paused"
                  storageKey={`seeker-saved-search-alert-${item.name}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel
        className="mt-6"
        title="Bookmarked jobs"
        description="Roles you saved from search and recommendations."
        bodyClassName="p-0"
        action={<span className="text-[13px] font-bold text-ts-muted">{seekerSummary.recommendedJobs.length} saved</span>}
      >
        <JobRows jobs={seekerSummary.recommendedJobs} />
      </SectionPanel>
    </>
  );
}

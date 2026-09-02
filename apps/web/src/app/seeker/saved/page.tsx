import type { Metadata } from "next";
import { Bookmark, Search } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { ToggleActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/job-card";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Saved jobs and alerts" };

export default function SavedPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Library"
        title="Saved jobs & alerts"
        description="Return to bookmarked roles and manage searches that notify you about new matches."
      />
      <SectionPanel title="Saved searches" description="Alert frequency and fresh-result counts.">
        <ul className="m-0 flex list-none flex-col p-0">
          {seekerSummary.savedSearches.map((item, index) => (
            <li key={item.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex flex-wrap items-center gap-3 py-2.5">
                <Search size={15} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[13px] font-semibold text-ts-ink">{item.name}</strong>
                  <p className="m-0 text-xs text-ts-muted">{item.count} roles</p>
                </div>
                <span className="inline-flex h-6 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{item.trend}</span>
                <ToggleActionButton
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ts-field bg-ts-surface px-3 text-[13px] font-medium text-ts-ink transition-colors hover:bg-ts-surface-2 aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
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
        className="mt-4"
        title="Bookmarked jobs"
        action={
          <Badge tone="neutral" size="sm" className="inline-flex items-center gap-1">
            <Bookmark size={12} aria-hidden="true" /> {seekerSummary.savedJobs} saved
          </Badge>
        }
      >
        <div className="job-grid">
          {seekerSummary.recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

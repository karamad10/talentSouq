import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { MeterBar } from "@/components/ui/meter-bar";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Assessment center" };

const providerFeatures = ["Reusable templates", "External provider URLs", "Candidate send history", "Completion tracking"];

export default function AssessmentsPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Evaluate"
        title="Assessment center"
        description="Create reusable assessments, connect providers, send tests, and track completion."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
            storageKey="employer-assessments-new"
            pendingLabel="Creating…"
            successLabel="Draft created"
          >
            New assessment
          </PreviewActionButton>
        }
      />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Templates", value: 2 },
          { label: "Sent", value: 13 },
          { label: "Completed", value: 8 }
        ]}
      />
      <SectionPanel title="Assessment library" description="Every template with its provider and completion progress.">
        <ul className="m-0 flex list-none flex-col p-0">
          {employerSummary.assessments.map((item, index) => (
            <li key={item.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex flex-wrap items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-ts-ink">{item.name}</strong>
                  <p className="m-0 text-xs text-ts-muted">Provider: {item.provider}</p>
                </div>
                <div className="w-56 max-[680px]:w-full">
                  <MeterBar label="Completed" used={item.completed} total={item.sent} detail={`${item.completed} of ${item.sent} sent`} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
      <SectionPanel
        className="mt-4"
        title="Provider setup"
        description="Supports provider name and tokenized assessment URL, then sends unique candidate links."
      >
        <div className="grid grid-cols-2 gap-2 max-[680px]:grid-cols-1">
          {providerFeatures.map((feature) => (
            <span key={feature} className="inline-flex items-center gap-2 text-[13px] text-ts-ink">
              <Check size={14} aria-hidden="true" className="shrink-0 text-ts-success" />
              {feature}
            </span>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

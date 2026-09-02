import type { Metadata } from "next";
import { Check } from "lucide-react";
import { AssessmentLibrary } from "@/components/dashboard/assessment-library";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Assessment center" };

const providerFeatures = ["Reusable templates", "External provider URLs", "Candidate send history", "Completion tracking"];

export default function AssessmentsPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Evaluate"
        title="Assessment center"
        description="Create reusable assessments, connect providers, send tests, and track completion."
      />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Templates", value: 2 },
          { label: "Sent", value: 13 },
          { label: "Completed", value: 8 }
        ]}
      />
      <AssessmentLibrary initial={employerSummary.assessments} />
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

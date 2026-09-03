import type { Metadata } from "next";
import { ClipboardCheck, Send, ShieldCheck, Timer } from "lucide-react";
import { AssessmentLibrary } from "@/components/dashboard/assessment-library";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { StatusPill } from "@/components/ui/status-pill";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Assessment center" };

const sendHistory = [
  { candidate: "Rami Farah", assessment: "Frontend practical", sent: "Monday", status: "Offer", detail: "Completed · 82%" },
  { candidate: "Noor Omar", assessment: "Product thinking exercise", sent: "Monday", status: "Interview", detail: "Completed · 91%" },
  { candidate: "Liam Khan", assessment: "Product thinking exercise", sent: "Tuesday", status: "Shortlisted", detail: "In progress" },
  { candidate: "Khalid Nasser", assessment: "Product thinking exercise", sent: "Wednesday", status: "Under review", detail: "Not started · expires in 3 days" }
];

export default function AssessmentsPage() {
  const sent = employerSummary.assessments.reduce((sum, row) => sum + row.sent, 0);
  const completed = employerSummary.assessments.reduce((sum, row) => sum + row.completed, 0);
  const rate = sent > 0 ? Math.round((completed / sent) * 100) : 0;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Evaluate"
        title="Assessment center"
        description="Create reusable assessments, connect providers, send tests, and track completion."
      />
      <KpiStrip
        className="mb-6"
        items={[
          { label: "Templates", value: employerSummary.assessments.length, detail: "ready to send", icon: ClipboardCheck },
          { label: "Sent", value: sent, detail: "this hiring cycle", icon: Send },
          { label: "Completed", value: completed, detail: `${rate}% completion rate`, tone: "success", icon: ShieldCheck },
          { label: "Expiring soon", value: 1, detail: "no response in 3 days", tone: "attention", icon: Timer }
        ]}
      />
      <AssessmentLibrary initial={employerSummary.assessments} />
      <SectionPanel
        className="mt-6"
        title="Send history"
        description="Who received which assessment, and where it landed."
        bodyClassName="p-0"
        action={<span className="text-[13px] font-bold text-ts-muted">{sendHistory.length} sends</span>}
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {sendHistory.map((row, index) => (
            <li key={`${row.candidate}-${row.assessment}`} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
                <div className="min-w-50 flex-1">
                  <strong className="block text-[15px] font-bold text-ts-ink">{row.candidate}</strong>
                  <p className="m-0 mt-1 text-[13px] text-ts-muted">
                    {row.assessment} · sent {row.sent}
                  </p>
                </div>
                <span className="w-56 shrink-0 text-[13px] font-semibold text-ts-ink max-[680px]:w-full">{row.detail}</span>
                <StatusPill status={row.status} className="shrink-0 px-3 py-1 text-xs" />
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </>
  );
}

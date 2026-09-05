import type { Metadata } from "next";
import { ClipboardCheck, Send, ShieldCheck, Timer } from "lucide-react";
import { AssessmentLibrary } from "@/components/dashboard/assessment-library";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { MetricCards } from "@/components/ui/metric-cards";
import { StatusPill } from "@/components/ui/status-pill";
import { IconTile, MiniMeter, PageBody, PersonAvatar, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Assessment center" };

const sendHistory = [
  { candidate: "Rami Farah", assessment: "Frontend practical", sent: "Monday", status: "Offer", detail: "Completed · 82%", stalled: false },
  { candidate: "Noor Omar", assessment: "Product thinking exercise", sent: "Monday", status: "Interview", detail: "Completed · 91%", stalled: false },
  { candidate: "Liam Khan", assessment: "Product thinking exercise", sent: "Tuesday", status: "Shortlisted", detail: "In progress", stalled: false },
  { candidate: "Khalid Nasser", assessment: "Product thinking exercise", sent: "Wednesday", status: "Under review", detail: "Not started · expires in 3 days", stalled: true }
];

export default function AssessmentsPage() {
  const sent = employerSummary.assessments.reduce((sum, row) => sum + row.sent, 0);
  const completed = employerSummary.assessments.reduce((sum, row) => sum + row.completed, 0);
  const rate = sent > 0 ? Math.round((completed / sent) * 100) : 0;
  const stalled = sendHistory.filter((row) => row.stalled);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Evaluate"
        title="Assessment center"
        description="Create reusable assessments, connect providers, send tests, and track completion."
      />

      <PageBody>
        <MetricCards
          items={[
            { label: "Templates", value: employerSummary.assessments.length, detail: "ready to send", icon: ClipboardCheck },
            { label: "Sent", value: sent, detail: "this hiring cycle", icon: Send },
            { label: "Completed", value: completed, detail: `${rate}% completion rate`, tone: "success", icon: ShieldCheck },
            { label: "Expiring soon", value: stalled.length, detail: "no response in 3 days", tone: "attention", icon: Timer }
          ]}
        />

        <SplitLayout
          rail={
            <>
              <SectionPanel title="Completion" bodyClassName="flex flex-col gap-4" flush>
                <div>
                  <strong className="block text-[28px] leading-none font-bold tracking-[-0.03em] text-ts-ink">{rate}%</strong>
                  <span className="mt-2 block text-[13px] text-ts-muted">
                    {completed} of {sent} sent assessments came back.
                  </span>
                </div>
                <MiniMeter value={completed} max={sent} ariaLabel="Overall assessment completion" />
              </SectionPanel>

              <SectionPanel title="Needs a nudge" description="Sent, but nothing back yet." bodyClassName="p-0">
                <ul className="m-0 flex list-none flex-col p-0">
                  {stalled.map((row, index) => (
                    <li key={row.candidate} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                      <div className="flex items-center gap-3 px-6 py-3.5">
                        <IconTile icon={Timer} tone="accent" size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ts-ink">{row.candidate}</span>
                          <span className="block text-[13px] text-ts-muted">{row.detail}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionPanel>
            </>
          }
        >
          <AssessmentLibrary initial={employerSummary.assessments} />

          <SectionPanel
            title="Send history"
            description="Who received which assessment, and where it landed."
            bodyClassName="p-0"
            action={<span className="shrink-0 text-[13px] font-bold text-ts-muted">{sendHistory.length} sends</span>}
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {sendHistory.map((row, index) => (
                <li key={`${row.candidate}-${row.assessment}`} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 max-[680px]:px-5">
                    <PersonAvatar name={row.candidate} />
                    <div className="min-w-45 flex-1">
                      <strong className="block text-sm font-bold text-ts-ink">{row.candidate}</strong>
                      <p className="m-0 mt-0.5 text-[13px] text-ts-muted">
                        {row.assessment} · sent {row.sent}
                      </p>
                    </div>
                    <span className="w-52 shrink-0 text-[13px] font-semibold text-ts-ink max-[680px]:w-full">{row.detail}</span>
                    <StatusPill status={row.status} className="shrink-0 px-2.5 py-0.5 text-[11px]" />
                  </div>
                </li>
              ))}
            </ul>
          </SectionPanel>
        </SplitLayout>
      </PageBody>
    </>
  );
}

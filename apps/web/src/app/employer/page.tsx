import type { Metadata } from "next";
import { BriefcaseBusiness, CalendarDays, Trophy, UsersRound } from "lucide-react";
import type { Route } from "next";
import { CreditsPanel, EmployerSpotlight, InterviewsPanel, TodayPanel } from "@/components/dashboard/employer-panels";
import { JobSummaryRow } from "@/components/dashboard/job-cards";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { MetricCards } from "@/components/ui/metric-cards";
import { HeaderAction, HeaderActions, PageBody, PanelAction, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Employer home", description: "Hiring operations overview for your company." };

const rejectedTotal = employerSummary.responses.reduce((sum, row) => sum + row.rejected, 0);
const liveJobs = employerSummary.responses.filter((row) => row.status !== "Draft");
const totalResponses = liveJobs.reduce((sum, row) => sum + row.total, 0);
const unreviewed = liveJobs.reduce((sum, row) => sum + row.fresh, 0);

export default async function EmployerDashboardPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow={employerSummary.organization}
        title="Hiring overview"
        description={`${employerSummary.newApplicants} new applicants this week across ${employerSummary.openRoles} open roles.`}
        actionSlot={
          <HeaderActions>
            <HeaderAction href="/employer/candidates">Search CVs</HeaderAction>
            <HeaderAction href="/employer/jobs/new" tone="primary">
              Post a job
            </HeaderAction>
          </HeaderActions>
        }
      />

      <PageBody>
        <EmployerSpotlight />

        {/* Four metrics, not six: messages and credits already have a home in
            the nav rail and the sidebar, and repeating them here earned nothing. */}
        <MetricCards
          items={[
            { label: "Open roles", value: employerSummary.openRoles, detail: "2 live, 1 draft", icon: BriefcaseBusiness, href: "/employer/jobs" },
            { label: "New applicants", value: employerSummary.newApplicants, detail: "last 7 days", tone: "attention", icon: UsersRound, href: "/employer/pipeline" },
            { label: "Interviews", value: employerSummary.interviews, detail: "2 today", icon: CalendarDays, href: "/employer/interviews" },
            { label: "Offers out", value: 2, detail: "awaiting reply", tone: "success", icon: Trophy, href: "/employer/pipeline?stage=Offer" as Route }
          ]}
        />

        <SplitLayout
          rail={
            <>
              <TodayPanel />
              <InterviewsPanel />
              <CreditsPanel />
            </>
          }
        >
          <SectionPanel
            title="Jobs & responses"
            description="How each listing is performing and how much of it you have reviewed."
            bodyClassName="p-0"
            action={<PanelAction href="/employer/jobs">Manage jobs</PanelAction>}
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {employerSummary.responses.map((row, index) => (
                <li key={row.job} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <JobSummaryRow row={row} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ts-line-soft bg-ts-surface-2/40 px-6 py-4 max-[680px]:px-5">
              <p className="m-0 text-[13px] text-ts-muted">
                <strong className="font-bold text-ts-ink">{totalResponses}</strong> total responses
              </p>
              <p className="m-0 text-[13px] text-ts-muted">
                <strong className="font-bold text-ts-ink">{unreviewed}</strong> still unreviewed
              </p>
            </div>
          </SectionPanel>

          <SectionPanel
            title="Pipeline this week"
            description="Stage volumes with the conversion into each next stage."
            bodyClassName="flex flex-col gap-4"
            flush
            action={<PanelAction href="/employer/pipeline">ATS board</PanelAction>}
          >
            <FunnelBars
              ariaLabel="Hiring pipeline by stage"
              stages={employerSummary.funnel.map((stage) => ({
                label: stage.label,
                count: stage.count,
                href: `/employer/pipeline?stage=${encodeURIComponent(stage.label)}` as Route
              }))}
            />
            <p className="m-0 rounded-ts-md bg-ts-surface-2/60 px-4 py-3 text-[13px] leading-relaxed text-ts-muted">
              {employerSummary.newApplicants} candidates in the pipeline · {rejectedTotal} rejected off-funnel · half of new applicants reach review.
            </p>
          </SectionPanel>
        </SplitLayout>
      </PageBody>
    </>
  );
}

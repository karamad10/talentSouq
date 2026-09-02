import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { EmployerRail } from "@/components/dashboard/employer-rail";
import { JobsResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { RecentApplicants } from "@/components/dashboard/recent-applicants";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { buttonVariants } from "@/components/ui/button";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Employer home", description: "Hiring operations overview for your company." };

const rejectedTotal = employerSummary.responses.reduce((sum, row) => sum + row.rejected, 0);

export default async function EmployerDashboardPage({ searchParams }: { searchParams: Promise<{ jobs?: string; range?: string }> }) {
  const params = await searchParams;
  const jobsFilter = params.jobs ?? "All";
  const interviewRange = params.range === "today" ? "today" : "week";

  return (
    <>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">Hiring overview</h1>
          <p className="m-0 mt-1 text-[13px] text-ts-muted">
            {employerSummary.newApplicants} new applicants this week across {employerSummary.openRoles} open roles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/employer/candidates" className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}>
            Search CVs
          </Link>
          <Link href="/employer/jobs" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}>
            Post a job
          </Link>
        </div>
      </header>

      <KpiStrip
        className="mb-4"
        items={[
          { label: "Open roles", value: employerSummary.openRoles, href: "/employer/jobs" },
          { label: "New applicants", value: employerSummary.newApplicants, detail: "last 7 days", href: "/employer/pipeline" },
          { label: "Unread messages", value: 5, href: "/employer/messages" },
          { label: "Interviews", value: employerSummary.interviews, href: "/employer/interviews" },
          { label: "Offers", value: 2, href: "/employer/pipeline?stage=Offer" as Route },
          { label: "Credits", value: employerSummary.plan.credits, href: "/employer/billing" }
        ]}
      />

      <div className="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionPanel
            title="Jobs & responses"
            description="How each listing is performing and how much of it you have reviewed."
            action={
              <Link href="/employer/jobs" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                Manage jobs <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            }
          >
            <JobsResponsesTable rows={employerSummary.responses} filter={jobsFilter} />
          </SectionPanel>

          <SectionPanel
            title="Pipeline this week"
            description="Stage volumes with the conversion into each next stage."
            action={
              <Link href="/employer/pipeline" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                Open ATS board <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            }
          >
            <FunnelBars
              ariaLabel="Hiring pipeline by stage"
              stages={employerSummary.funnel.map((stage) => ({
                label: stage.label,
                count: stage.count,
                href: `/employer/pipeline?stage=${encodeURIComponent(stage.label)}` as Route
              }))}
            />
            <p className="m-0 mt-3 border-t border-ts-line pt-3 text-xs text-ts-muted">
              {employerSummary.newApplicants} in pipeline · {rejectedTotal} rejected off-funnel
            </p>
          </SectionPanel>

          <SectionPanel
            title="Recent applicants"
            description="The newest candidates waiting on a decision."
            action={
              <Link href="/employer/pipeline" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                View all <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            }
          >
            <RecentApplicants candidates={employerSummary.pipeline} />
          </SectionPanel>
        </div>

        <EmployerRail interviewRange={interviewRange} />
      </div>
    </>
  );
}

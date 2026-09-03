import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CreditCard, MessageSquare, Trophy, UsersRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import {
  CreditsPanel,
  EmployerQuickActions,
  EmployerSpotlight,
  InterviewsPanel,
  SourcingPanel,
  TodayPanel
} from "@/components/dashboard/employer-panels";
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

export default async function EmployerDashboardPage({ searchParams }: { searchParams: Promise<{ jobs?: string }> }) {
  const params = await searchParams;
  const jobsFilter = params.jobs ?? "All";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="m-0 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-ts-ink max-[680px]:text-[26px]">Hiring overview</h1>
          <p className="m-0 mt-2 text-[15px] text-ts-muted">
            {employerSummary.newApplicants} new applicants this week across {employerSummary.openRoles} open roles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/employer/candidates" className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-[15px]")}>
            Search CVs
          </Link>
          <Link href="/employer/jobs/new" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-[15px]")}>
            Post a job
          </Link>
        </div>
      </header>

      <KpiStrip
        items={[
          { label: "Open roles", value: employerSummary.openRoles, detail: "2 live, 1 draft", icon: BriefcaseBusiness, href: "/employer/jobs" },
          { label: "New applicants", value: employerSummary.newApplicants, detail: "last 7 days", tone: "attention", icon: UsersRound, href: "/employer/pipeline" },
          { label: "Unread messages", value: employerSummary.unreadMessages, detail: "oldest is 1h", icon: MessageSquare, href: "/employer/messages" },
          { label: "Interviews", value: employerSummary.interviews, detail: "2 today", icon: CalendarDays, href: "/employer/interviews" },
          { label: "Offers", value: 2, detail: "awaiting response", tone: "success", icon: Trophy, href: "/employer/pipeline?stage=Offer" as Route },
          { label: "Credits", value: employerSummary.plan.credits, detail: `${employerSummary.plan.name} plan`, icon: CreditCard, href: "/employer/billing" }
        ]}
      />

      <EmployerSpotlight />

      {/* Below 1560px the jobs table takes the full width and the two side panels
          sit next to each other; above it, the table runs tall beside them. */}
      <div className="grid items-stretch gap-6 min-[900px]:grid-cols-2 min-[1560px]:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        <SectionPanel
          title="Jobs & responses"
          description="How each listing is performing and how much of it you have reviewed."
          className="min-w-0 min-[900px]:col-span-2 min-[1560px]:col-span-1 min-[1560px]:row-span-2"
          bodyClassName="flex flex-col"
          action={
            <Link href="/employer/jobs" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
              Manage jobs <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          }
        >
          <JobsResponsesTable rows={employerSummary.responses} filter={jobsFilter} />
        </SectionPanel>

        <TodayPanel className="min-w-0" />
        <InterviewsPanel className="min-w-0" />
      </div>

      <div className="grid items-stretch gap-6 min-[900px]:grid-cols-2 min-[1280px]:grid-cols-3">
        <SectionPanel
          title="Pipeline this week"
          description="Stage volumes with the conversion into each next stage."
          className="min-w-0"
          bodyClassName="flex flex-col gap-5"
          action={
            <Link href="/employer/pipeline" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
              ATS board <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
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
          <p className="m-0 mt-auto rounded-ts-md bg-ts-surface-2 px-4 py-3 text-[13px] leading-relaxed text-ts-muted">
            {employerSummary.newApplicants} candidates in the pipeline · {rejectedTotal} rejected off-funnel · half of new applicants reach review.
          </p>
        </SectionPanel>

        <SectionPanel
          title="Recent applicants"
          description="The newest candidates waiting on a decision."
          className="min-w-0"
          bodyClassName="flex flex-col p-0"
          action={
            <Link href="/employer/pipeline" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
              View all <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          }
        >
          <RecentApplicants candidates={employerSummary.pipeline} />
        </SectionPanel>

        <CreditsPanel className="min-w-0 min-[900px]:col-span-2 min-[1280px]:col-span-1" />
      </div>

      <div className="grid items-stretch gap-6 min-[1280px]:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <SourcingPanel className="min-w-0" />
        <EmployerQuickActions className="min-w-0" />
      </div>
    </div>
  );
}

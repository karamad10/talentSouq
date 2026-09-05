import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Eye, FileCheck2, MessageSquare, Trophy } from "lucide-react";
import Link from "next/link";
import { ApplicationTracker } from "@/components/dashboard/application-tracker";
import { SectionPanel } from "@/components/dashboard/section-panel";
import {
  AlertsPanel,
  MatchesPanel,
  MessagesPanel,
  PrioritySpotlight,
  ProfileStrengthPanel,
  QuickActionsPanel,
  SearchProgressPanel
} from "@/components/dashboard/seeker-panels";
import { buttonVariants } from "@/components/ui/button";
import { MetricCards } from "@/components/ui/metric-cards";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Seeker home", description: "Your job search overview and next actions." };

const freshTotal = seekerSummary.savedSearches.reduce((sum, search) => sum + Number(search.trend.replace(/\D/g, "")), 0);

export default async function SeekerDashboardPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams;
  const view = params.view ?? "all";
  const easyApplies = seekerSummary.applications.length - seekerSummary.externalApplications;
  const rows =
    view === "external"
      ? seekerSummary.applications.slice(-seekerSummary.externalApplications)
      : view === "easy"
        ? seekerSummary.applications.slice(0, easyApplies)
        : seekerSummary.applications;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="m-0 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-ts-ink max-[680px]:text-[26px]">Good morning, Sarah.</h1>
          <p className="m-0 mt-2 text-[15px] text-ts-muted">
            2 items need a reply · {freshTotal} fresh matches across your alerts.
          </p>
        </div>
        <Link href="/seeker/profile" className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-[15px]")}>
          Update profile
        </Link>
      </header>

      <MetricCards
        items={[
          { label: "Applications", value: seekerSummary.applications.length, detail: `${easyApplies} easy applies`, icon: BriefcaseBusiness, href: "/seeker/applications" },
          { label: "In progress", value: 5, detail: "across 4 companies", icon: FileCheck2, href: "/seeker/applications" },
          { label: "Interviews", value: seekerSummary.interviews, detail: "1 needs a time", tone: "attention", icon: CalendarDays, href: "/seeker/offers" },
          { label: "Offers", value: 1, detail: "respond by Thursday", tone: "success", icon: Trophy, href: "/seeker/offers" },
          { label: "Profile views", value: seekerSummary.weeklyViews, detail: "+12% this week", tone: "success", icon: Eye, href: "/seeker/profile" },
          { label: "Unread", value: seekerSummary.unreadMessages, detail: "2 need a reply", icon: MessageSquare, href: "/seeker/messages" }
        ]}
      />

      <PrioritySpotlight />

      {/* One grid, two shapes: below 1560px the tracker takes the full width and
          Messages/New matches sit side by side; above it, the tracker runs tall
          beside them so neither column is left with dead space. */}
      <div className="grid items-stretch gap-6 min-[900px]:grid-cols-2 min-[1560px]:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        <SectionPanel
          title="Application tracker"
          description="Every live application with its stage, match, and the next thing to do."
          className="min-w-0 min-[900px]:col-span-2 min-[1560px]:col-span-1 min-[1560px]:row-span-2"
          bodyClassName="flex flex-col"
          action={
            <Link href="/seeker/applications" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
              Open tracker <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          }
        >
          <ApplicationTracker
            rows={rows}
            view={view}
            counts={{ all: seekerSummary.applications.length, easy: easyApplies, external: seekerSummary.externalApplications }}
          />
        </SectionPanel>

        <MessagesPanel className="min-w-0" />
        <MatchesPanel className="min-w-0" />
      </div>

      <div className="grid items-stretch gap-6 min-[900px]:grid-cols-2 min-[1280px]:grid-cols-3">
        <AlertsPanel className="min-w-0" />
        <SearchProgressPanel className="min-w-0" />
        <ProfileStrengthPanel className="min-w-0 min-[900px]:col-span-2 min-[1280px]:col-span-1" />
      </div>

      <QuickActionsPanel />
    </div>
  );
}

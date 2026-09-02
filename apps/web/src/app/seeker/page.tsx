import type { Metadata } from "next";
import { ArrowUpRight, Bell } from "lucide-react";
import Link from "next/link";
import { ApplicationTracker } from "@/components/dashboard/application-tracker";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { SeekerRail } from "@/components/dashboard/seeker-rail";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
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
    <>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">Good morning, Sarah.</h1>
          <p className="m-0 mt-1 text-[13px] text-ts-muted">
            2 items need a reply · {freshTotal} fresh matches across your alerts.
          </p>
        </div>
        <Link href="/seeker/jobs" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}>
          Discover jobs
        </Link>
      </header>

      <KpiStrip
        className="mb-4"
        items={[
          { label: "Applications", value: seekerSummary.applications.length, href: "/seeker/applications" },
          { label: "In progress", value: 5, href: "/seeker/applications" },
          { label: "Interviews", value: seekerSummary.interviews, href: "/seeker/offers" },
          { label: "Offers", value: 1, href: "/seeker/offers" },
          { label: "Profile views", value: seekerSummary.weeklyViews, detail: "+12% this week", tone: "success", href: "/seeker/profile" },
          { label: "Unread", value: seekerSummary.unreadMessages, href: "/seeker/messages" }
        ]}
      />

      <div className="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionPanel
            title="Application tracker"
            description="Every live application with its stage, match, and the next thing to do."
            action={
              <Link href="/seeker/applications" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                Open tracker <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            }
          >
            <ApplicationTracker
              rows={rows}
              view={view}
              counts={{ all: seekerSummary.applications.length, easy: easyApplies, external: seekerSummary.externalApplications }}
            />
          </SectionPanel>

          <SectionPanel
            title="Alerts & saved searches"
            description="Fresh roles found since you last looked."
            action={
              <Link href="/seeker/saved" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
                Manage alerts <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            }
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {seekerSummary.savedSearches.map((search, index) => (
                <li key={search.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <Link href="/seeker/saved" className="group flex items-center gap-3 py-2.5">
                    <Bell size={15} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ts-ink group-hover:text-ts-primary-deep">{search.name}</span>
                      <span className="block text-xs text-ts-muted">{search.count} roles</span>
                    </span>
                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{search.trend}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionPanel>
        </div>

        <SeekerRail />
      </div>
    </>
  );
}

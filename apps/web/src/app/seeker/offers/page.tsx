import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { StatusPill } from "@/components/ui/status-pill";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Offers and interviews" };

export default function OffersPage() {
  return (
    <>
      <WorkspaceHeader eyebrow="Progress" title="Offers & interviews" description="Prepare for conversations, track schedules, and compare final packages." />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Upcoming interviews", value: 2 },
          { label: "Offer received", value: 1 },
          { label: "Decision due", value: 1, detail: "Respond by Thursday", tone: "attention" }
        ]}
      />
      <SectionPanel title="Current opportunities" description="Interview and offer stages are separated from the application list.">
        <div className="grid gap-3 min-[981px]:grid-cols-2">
          {seekerSummary.offers.map((offer) => (
            <article key={offer.company} className="flex flex-col gap-2 rounded-ts-md border border-ts-line bg-ts-surface p-4">
              <StatusPill status={offer.status} className="self-start" />
              <div>
                <h3 className="m-0 text-base font-semibold text-ts-ink">{offer.role}</h3>
                <p className="m-0 mt-0.5 text-[13px] text-ts-muted">{offer.company}</p>
              </div>
              <strong className="text-sm font-bold text-ts-ink">{offer.salary}</strong>
              <small className="text-xs font-semibold text-ts-accent-deep">{offer.deadline}</small>
              <footer className="mt-1 flex flex-wrap items-center gap-2 border-t border-ts-line pt-3">
                <PreviewActionButton
                  type="button"
                  className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
                  storageKey={`seeker-offer-details-${offer.company}`}
                  successLabel="Opened"
                >
                  View details
                </PreviewActionButton>
                <Link
                  href={"/seeker/messages" as Route}
                  className="inline-flex h-8 items-center rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
                >
                  Message employer
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </SectionPanel>
      <SectionPanel className="mt-4" title="Interview preparation" description="Meeting links, people, time zones, notes, and reminders will live here.">
        <div className="flex items-start gap-3 rounded-ts-md bg-ts-primary-tint/60 p-3">
          <CalendarDays size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-ts-primary" />
          <div>
            <strong className="block text-[13px] font-semibold text-ts-ink">Nexa Commerce · Final interview</strong>
            <p className="m-0 mt-0.5 text-xs leading-relaxed text-ts-muted">Tomorrow, 10:30 AM GST · Video call · Maya and Omar</p>
          </div>
        </div>
      </SectionPanel>
    </>
  );
}

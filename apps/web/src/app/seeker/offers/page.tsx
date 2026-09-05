import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, Clock3, MessageSquare, Users, Video } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { OfferDetailsDialog } from "@/components/dashboard/offer-details-dialog";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { MetricCards } from "@/components/ui/metric-cards";
import { StatusPill } from "@/components/ui/status-pill";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Offers and interviews" };

const interviews = [
  {
    company: "Nexa Commerce",
    role: "Senior Product Designer",
    when: "Tomorrow · 10:30 AM GST",
    mode: "Video call",
    panel: "Maya Hassan, Omar Rahman",
    threadId: "maya-nexa",
    action: "Confirm your slot"
  },
  {
    company: "Cedar Labs",
    role: "Frontend Engineer",
    when: "Next Tuesday · 2:00 PM GST",
    mode: "Video call",
    panel: "Omar Rahman",
    threadId: "omar-cedar",
    action: "Intro call to schedule"
  }
];

export default function OffersPage() {
  return (
    <>
      <WorkspaceHeader eyebrow="Progress" title="Offers & interviews" description="Prepare for conversations, track schedules, and compare final packages." />
      <MetricCards
        className="mb-6"
        items={[
          { label: "Upcoming interviews", value: interviews.length, detail: "next one tomorrow", icon: CalendarDays, href: "/seeker/offers" },
          { label: "Offers received", value: 1, detail: "AED 34k/mo", tone: "success", icon: CheckCircle2, href: "/seeker/offers" },
          { label: "Decision due", value: 1, detail: "Respond by Thursday", tone: "attention", icon: Clock3, href: "/seeker/offers" },
          { label: "Awaiting your reply", value: 2, detail: "in messages", icon: MessageSquare, href: "/seeker/messages" }
        ]}
      />

      <SectionPanel title="Current opportunities" description="Interview and offer stages, separated from the full application list.">
        <div className="grid gap-4 min-[981px]:grid-cols-2">
          {seekerSummary.offers.map((offer) => (
            <article key={offer.id} className="flex flex-col gap-3 rounded-ts-md border border-ts-line-soft bg-ts-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="m-0 text-[17px] font-bold text-ts-ink">{offer.role}</h3>
                  <p className="m-0 mt-1 text-sm text-ts-muted">
                    {offer.company} · {offer.location}
                  </p>
                </div>
                <StatusPill status={offer.status} className="shrink-0 px-3 py-1 text-xs" />
              </div>

              <dl className="m-0 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-ts-muted">Package</dt>
                  <dd className="m-0 text-sm font-bold text-ts-ink">{offer.salary}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-ts-muted">Next deadline</dt>
                  <dd className="m-0 text-sm font-bold text-ts-accent-deep">{offer.deadline}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-ts-muted">Your contact</dt>
                  <dd className="m-0 text-sm font-semibold text-ts-ink">{offer.contact}</dd>
                </div>
              </dl>

              <footer className="mt-auto flex flex-wrap items-center gap-3 border-t border-ts-line-soft pt-4">
                <OfferDetailsDialog
                  offer={offer}
                  triggerClassName="inline-flex h-11 items-center gap-2 rounded-ts-md bg-ts-primary px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                />
                <Link
                  href={`/seeker/messages?thread=${offer.threadId}` as Route}
                  className="inline-flex h-11 items-center gap-2 rounded-ts-md border border-ts-line-soft bg-ts-surface px-5 text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                >
                  <MessageSquare size={15} aria-hidden="true" /> Message employer
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        className="mt-6"
        title="Interview schedule"
        description="Times, formats, and who you will be meeting."
        bodyClassName="p-0"
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {interviews.map((interview, index) => (
            <li key={interview.company} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
              <div className="flex flex-wrap items-center gap-4 px-6 py-5 max-[680px]:px-4">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
                  <Video size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[15px] font-bold text-ts-ink">
                    {interview.company} · {interview.role}
                  </p>
                  <p className="m-0 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ts-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} aria-hidden="true" /> {interview.when}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={13} aria-hidden="true" /> {interview.panel}
                    </span>
                    <span>{interview.mode}</span>
                  </p>
                </div>
                <Link
                  href={`/seeker/messages?thread=${interview.threadId}` as Route}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                >
                  {interview.action}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel className="mt-6" title="Interview preparation" description="What to review before each conversation.">
        <ul className="m-0 grid list-none gap-4 p-0 min-[760px]:grid-cols-3">
          {[
            { title: "Portfolio walkthrough", detail: "Lead with the commerce checkout case study — it maps to the Nexa brief." },
            { title: "Design systems story", detail: "Have adoption numbers ready: teams onboarded, components shipped." },
            { title: "Questions to ask", detail: "Team shape, design maturity, and how success is measured in the first 90 days." }
          ].map((card) => (
            <li key={card.title} className="rounded-ts-md border border-ts-line-soft bg-ts-surface-2/50 p-4">
              <strong className="block text-sm font-bold text-ts-ink">{card.title}</strong>
              <p className="m-0 mt-1.5 text-[13px] leading-relaxed text-ts-muted">{card.detail}</p>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </>
  );
}

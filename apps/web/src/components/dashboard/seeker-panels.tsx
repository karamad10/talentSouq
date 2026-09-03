import {
  ArrowUpRight,
  Bell,
  CalendarClock,
  CircleCheck,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  UserRound
} from "lucide-react";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { Ring } from "@/components/ui/ring";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

const quickActions: { icon: LucideIcon; label: string; detail: string; href: Route }[] = [
  { icon: Search, label: "Discover jobs", detail: "13 fresh matches", href: "/seeker/jobs" },
  { icon: CalendarClock, label: "Pick interview slots", detail: "Nexa Commerce is waiting", href: "/seeker/offers" },
  { icon: UserRound, label: "Improve profile", detail: `${seekerSummary.profile.completeness}% complete`, href: "/seeker/profile" },
  { icon: MessageSquare, label: "Reply to messages", detail: `${seekerSummary.unreadMessages} unread`, href: "/seeker/messages" },
  { icon: Bell, label: "Manage alerts", detail: `${seekerSummary.savedSearches.length} saved searches`, href: "/seeker/saved" },
  { icon: Sparkles, label: "Open AI companion", detail: "Weekly digest ready", href: "/seeker/companion" }
];

/** Two-letter monogram used to anchor list rows. */
function monogram(value: string) {
  return value
    .replace(/·.*$/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The single most important thing on the page: a full-bleed spotlight with the
 * action to take now, and the two other things that are live this week beside
 * it so the band carries its own width instead of leaving a gap.
 */
export function PrioritySpotlight() {
  const [, ...alsoThisWeek] = seekerSummary.week;

  return (
    <section className="grid gap-6 overflow-hidden rounded-ts-lg border border-ts-primary/25 bg-ts-primary-tint px-8 py-6 min-[1400px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[1400px]:items-center max-[680px]:px-5 max-[680px]:py-5">
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-ts-primary-deep uppercase">
          <span aria-hidden="true" className="inline-block size-2 rounded-full bg-ts-accent" />
          Priority today
        </p>
        <h2 className="m-0 mt-2.5 text-[26px] leading-[1.15] font-bold tracking-[-0.025em] text-ts-ink max-[680px]:text-[22px]">Choose your interview time</h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/seeker/offers"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md bg-ts-primary-deep px-6 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Review invitation <ArrowUpRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/seeker/messages"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md border border-ts-primary/40 bg-ts-surface px-6 text-[15px] font-bold text-ts-primary-deep transition-colors hover:bg-ts-surface-2"
          >
            Message Maya
          </Link>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-ts-md bg-ts-primary/15 p-0">
        {alsoThisWeek.map((item) => (
          <li key={item.title}>
            <Link href="/seeker/offers" className="group flex items-start gap-3.5 bg-ts-surface px-5 py-4 transition-colors hover:bg-ts-surface-2">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 grid size-9 shrink-0 place-items-center rounded-ts-sm",
                  item.tone === "success" ? "bg-ts-success-tint text-ts-success" : "bg-ts-primary-tint text-ts-primary"
                )}
              >
                {item.tone === "success" ? <CircleCheck size={18} /> : <Bell size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ts-ink group-hover:text-ts-primary-deep">{item.title}</span>
                <span className="block text-[13px] text-ts-muted">{item.detail}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold whitespace-nowrap text-ts-muted">{item.when}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MatchesPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="New matches"
      description="Roles scored against your profile and preferences."
      className={className}
      bodyClassName="flex flex-col p-0"
      action={
        <Link href="/seeker/jobs" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          See all <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col p-0">
        {seekerSummary.matches.map((match, index) => (
          <li key={match.title} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
            <Link href="/seeker/jobs" className="group flex w-full items-center gap-3.5 px-6 py-4 transition-colors hover:bg-ts-primary-tint/40 max-[680px]:px-4">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-slate-tint text-sm font-bold text-ts-muted">
                {monogram(match.company)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{match.title}</span>
                <span className="block truncate text-[13px] text-ts-muted">
                  {match.company} · {match.location}
                </span>
              </span>
              <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-sm font-bold text-ts-primary-deep">{match.score}%</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export function MessagesPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Messages"
      description={`${seekerSummary.unreadMessages} conversations need a reply.`}
      className={className}
      bodyClassName="flex flex-col p-0"
      action={
        <Link href="/seeker/messages" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Open inbox <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col p-0">
        {seekerSummary.messages.map((message, index) => (
          <li key={message.subject} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
            <Link href="/seeker/messages" className="group flex w-full items-center gap-3.5 px-6 py-4 transition-colors hover:bg-ts-primary-tint/40 max-[680px]:px-4">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                {monogram(message.from)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{message.from}</span>
                <span className="block truncate text-[13px] text-ts-muted">{message.subject}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-[13px] font-semibold text-ts-muted">
                {index === 0 ? <span aria-hidden="true" className="inline-block size-2 rounded-full bg-ts-accent" /> : null}
                {message.time}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}

export function AlertsPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Alerts & saved searches"
      description="Fresh roles found since you last looked."
      className={className}
      bodyClassName="flex flex-col p-0"
      action={
        <Link href="/seeker/saved" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Manage <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex flex-1 list-none flex-col p-0">
        {seekerSummary.savedSearches.map((search, index) => (
          <li key={search.name} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
            <Link href="/seeker/saved" className="group flex w-full items-center gap-3.5 px-6 py-4 transition-colors hover:bg-ts-primary-tint/40 max-[680px]:px-4">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-slate-tint text-ts-subtle">
                <Bell size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{search.name}</span>
                <span className="block text-[13px] text-ts-muted">{search.count} roles tracked</span>
              </span>
              <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-bold text-ts-primary-deep">{search.trend}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-ts-line px-6 py-4 max-[680px]:px-4">
        <Link
          href="/seeker/jobs"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
        >
          <Plus size={16} aria-hidden="true" /> Create a new alert
        </Link>
      </div>
    </SectionPanel>
  );
}

/** Profile readiness: one headline ring plus the four things that move it. */
export function ProfileStrengthPanel({ className }: { className?: string }) {
  return (
    <SectionPanel
      title="Profile strength"
      description="What recruiters see when they open your profile."
      className={className}
      bodyClassName="flex flex-col gap-5"
      action={
        <Link href="/seeker/profile" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Improve <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <div className="flex items-center gap-5">
        <Ring
          value={seekerSummary.profile.completeness}
          size={92}
          strokeWidth={9}
          label="Profile completeness"
          valueClassName="text-lg font-bold tracking-[-0.02em]"
        />
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-bold text-ts-ink">{seekerSummary.profileStrength} standing</p>
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-ts-muted">
            {seekerSummary.weeklyViews} profile views this week · {seekerSummary.responseRate}% response rate.
          </p>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {seekerSummary.readiness.map((item) => (
          <li key={item.label} className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ts-ink">{item.label}</span>
              <span className={cn("text-[13px] font-bold", item.tone === "attention" ? "text-ts-accent-deep" : "text-ts-muted")}>{item.value}%</span>
            </span>
            <span
              role="progressbar"
              aria-label={item.label}
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={100}
              className="block h-2 overflow-hidden rounded-full bg-ts-surface-2"
            >
              <span className={cn("block h-full rounded-full", item.tone === "attention" ? "bg-ts-accent" : "bg-ts-primary")} style={{ width: `${item.value}%` }} />
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/seeker/profile"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
      >
        <FileText size={16} aria-hidden="true" /> Add a portfolio case study
      </Link>
    </SectionPanel>
  );
}

/** Where every application currently sits, as a stage-by-stage funnel. */
export function SearchProgressPanel({ className }: { className?: string }) {
  const stages = seekerSummary.timeline;
  const peak = Math.max(1, ...stages.map((stage) => stage.count));

  return (
    <SectionPanel
      title="Search progress"
      description="How far your applications have travelled this season."
      className={className}
      bodyClassName="flex flex-col gap-5"
      action={
        <Link href="/seeker/applications" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
          Details <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {stages.map((stage, index) => {
          const previous = stages[index - 1];
          const conversion = previous && previous.count > 0 ? Math.round((stage.count / previous.count) * 100) : null;
          return (
            <li key={stage.label} className="flex items-center gap-4">
              <span className="w-22 shrink-0 text-sm font-semibold text-ts-ink">{stage.label}</span>
              <span aria-hidden="true" className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ts-surface-2">
                <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${Math.max(3, (stage.count / peak) * 100)}%` }} />
              </span>
              <span className="w-24 shrink-0 text-end">
                <span className="text-base font-bold text-ts-ink">{stage.count}</span>
                {conversion !== null ? <span className="ms-1.5 text-xs text-ts-muted">{conversion}%</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="m-0 mt-auto rounded-ts-md bg-ts-surface-2 px-4 py-3 text-[13px] leading-relaxed text-ts-muted">
        You convert to interview at more than twice the platform average. Keep the pipeline full — {seekerSummary.savedJobs} saved jobs are still unapplied.
      </p>
    </SectionPanel>
  );
}

export function QuickActionsPanel({ className }: { className?: string }) {
  return (
    <SectionPanel title="Quick actions" description="Jump straight into the things that need you." className={className}>
      <div className="grid grid-cols-2 gap-4 min-[760px]:grid-cols-3 min-[1560px]:grid-cols-6">
        {quickActions.map(({ icon: Icon, label, detail, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-4 rounded-ts-md border border-ts-line p-4 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-3 min-[1560px]:flex-col min-[1560px]:items-start min-[1560px]:gap-3.5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-ts-ink group-hover:text-ts-primary-deep">{label}</span>
              <span className="mt-0.5 block text-[13px] text-ts-muted">{detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </SectionPanel>
  );
}

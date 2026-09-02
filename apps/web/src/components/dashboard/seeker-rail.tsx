import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { MeterBar } from "@/components/ui/meter-bar";
import { Ring } from "@/components/ui/ring";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { seekerSummary } from "@/data/workspace";

export function SeekerRail() {
  const weakest = [...seekerSummary.readiness].sort((a, b) => a.value - b.value).slice(0, 2);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-ts-lg bg-ts-primary-tint p-4">
        <p className="m-0 text-[11px] font-semibold text-ts-primary-deep">Priority today</p>
        <h2 className="m-0 mt-1 text-sm font-semibold text-ts-ink">Choose your interview time</h2>
        <p className="m-0 mt-1 text-xs leading-relaxed text-ts-muted">Nexa Commerce is waiting on availability for the Senior Product Designer role.</p>
        <Link href="/seeker/offers" className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary-deep">
          Review invitation <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </section>

      <SectionPanel
        title="New matches"
        action={
          <Link href="/seeker/jobs" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
            See all <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        }
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {seekerSummary.matches.map((match, index) => (
            <li key={match.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <Link href="/seeker/jobs" className="group flex items-center gap-2.5 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ts-ink group-hover:text-ts-primary-deep">{match.title}</span>
                  <span className="block truncate text-xs text-ts-muted">
                    {match.company} · {match.location}
                  </span>
                </span>
                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{match.score}%</span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel
        title="Messages"
        action={
          <Link href="/seeker/messages" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
            Open <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        }
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {seekerSummary.messages.map((message, index) => (
            <li key={message.subject} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex items-center gap-2.5 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ts-ink">{message.from}</span>
                  <span className="block truncate text-xs text-ts-muted">{message.subject}</span>
                </span>
                <span className="shrink-0 text-xs text-ts-muted">{message.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <SectionPanel title="Profile strength">
        <div className="flex items-center gap-4">
          <Ring value={seekerSummary.profile.completeness} size={56} label="Profile completeness" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            {weakest.map((item) => (
              <MeterBar key={item.label} label={item.label} used={item.value} total={100} />
            ))}
          </div>
        </div>
        <Link href="/seeker/profile" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
          Improve profile <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </SectionPanel>

      <SectionPanel title="AI companion">
        <div className="flex items-start gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
            <Sparkles size={15} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="m-0 text-[13px] font-semibold text-ts-ink">Weekly match digest is ready</p>
            <p className="m-0 mt-0.5 text-xs leading-relaxed text-ts-muted">{seekerSummary.companion.summary}</p>
          </div>
        </div>
        <Link href="/seeker/companion" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
          Open companion <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </SectionPanel>
    </div>
  );
}

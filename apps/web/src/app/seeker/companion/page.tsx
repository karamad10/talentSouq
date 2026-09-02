import type { Metadata } from "next";
import { Bell, MapPin, Sparkles, Target } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "AI job companion" };

const signals = [
  { title: "Design systems", body: "Appears in 8 high-fit roles and is a proven strength." },
  { title: "Commerce", body: "Your domain experience improves ranking across retail platforms." },
  { title: "Leadership scope", body: "Team mentorship is becoming a common requirement." }
];

export default function CompanionPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Match intelligence"
        title="AI job companion"
        description="A guided search brief that finds and explains stronger-fit roles each week."
        action={{ href: "/seeker/jobs", label: "View matches" }}
      />
      <div className="grid items-start gap-4 min-[981px]:grid-cols-2">
        <SectionPanel title="Your search brief" description="Built from the companion setup flow.">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <p className="m-0 text-sm leading-relaxed text-ts-ink">{seekerSummary.companion.summary}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {seekerSummary.companion.skills.map((skill) => (
              <span key={skill} className="inline-flex h-7 items-center rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-ink">
                {skill}
              </span>
            ))}
          </div>
          <footer className="mt-3 flex items-center justify-between gap-3 border-t border-ts-line pt-3">
            <strong className="text-[13px] font-semibold text-ts-ink">{seekerSummary.companion.cooldown}</strong>
            <span className="text-xs font-semibold text-ts-success">Weekly matches on</span>
          </footer>
        </SectionPanel>
        <SectionPanel title="Preferences">
          <ul className="m-0 flex list-none flex-col p-0">
            {[
              { icon: Target, label: "Seniority", value: "Senior / Lead" },
              { icon: MapPin, label: "Location", value: "UAE + GCC remote" },
              { icon: Bell, label: "Digest", value: "Every Monday" }
            ].map((row, index) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <div className="flex items-center gap-3 py-2.5">
                    <Icon size={15} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                    <span className="w-24 text-xs font-semibold text-ts-muted">{row.label}</span>
                    <strong className="min-w-0 truncate text-[13px] font-semibold text-ts-ink">{row.value}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionPanel>
      </div>
      <SectionPanel className="mt-4" title="This week’s match signals" description="Why the companion is recommending these roles.">
        <div className="grid grid-cols-3 gap-3 max-[680px]:grid-cols-1">
          {signals.map((signal) => (
            <article key={signal.title} className="rounded-ts-md border border-ts-line bg-ts-surface p-3.5">
              <strong className="block text-[13px] font-semibold text-ts-ink">{signal.title}</strong>
              <p className="m-0 mt-1 text-xs leading-relaxed text-ts-muted">{signal.body}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

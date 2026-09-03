import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock3, Gauge, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CompanionRun } from "@/components/dashboard/companion-run";
import { salaryLabel } from "@/components/dashboard/job-list";
import { EditableChips, EditableField, EditableToggle } from "@/components/dashboard/profile-editing";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { jobs, type Job } from "@/data/jobs";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "AI job companion" };

const KEY = "talentsouq:seeker:companion";

/** The brief the companion matches against — the same numbers used in the reasons below. */
const BRIEF = {
  targetRoles: "Senior Product Designer, Design Systems Lead",
  seniority: "Senior or Lead",
  locations: "UAE first, open across the GCC",
  mode: "Hybrid or remote",
  salaryFloor: 28000,
  preferredModes: ["Hybrid", "Remote"],
  homeCountry: "UAE"
};

/** Why a role surfaced, computed from the profile rather than written by hand. */
function matchReasons(job: Job): string[] {
  const reasons: string[] = [];
  const shared = job.skills.filter((skill) => seekerSummary.profile.skills.includes(skill));
  if (shared.length > 0) reasons.push(`${shared.length} skill${shared.length === 1 ? "" : "s"} in common: ${shared.slice(0, 3).join(", ")}`);
  if (["Senior", "Lead", "Executive"].includes(job.seniority)) reasons.push(`${job.seniority} scope, matching your level`);
  if (BRIEF.preferredModes.includes(job.mode)) reasons.push(`${job.mode}, your preferred way of working`);
  if (job.country === BRIEF.homeCountry) reasons.push("In your home market");
  if (job.salaryMin >= BRIEF.salaryFloor) reasons.push(`Starts above your ${job.currency} ${BRIEF.salaryFloor / 1000}k floor`);
  if (job.easyApply) reasons.push("Easy apply with your TalentSouq profile");
  return reasons.slice(0, 4);
}

const activity = [
  { title: "Scanned 16 open roles against your brief", detail: "4 cleared the 85% bar", when: "Today · 07:00" },
  { title: "Raised the salary floor to AED 28k", detail: "You updated it from your profile", when: "Yesterday" },
  { title: "Dropped 3 on-site-only roles", detail: "Outside your hybrid and remote preference", when: "Yesterday" },
  { title: "Weekly digest sent", detail: "13 fresh matches, 3 above 85% fit", when: "Monday · 07:00" },
  { title: "Learned from your saved jobs", detail: "Design systems weighting increased", when: "Last week" }
];

export default function CompanionPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const picks = ranked.slice(0, 4);
  const strongMatches = ranked.filter((job) => job.matchScore >= 85).length;
  const averageMatch = Math.round(ranked.slice(0, 8).reduce((sum, job) => sum + job.matchScore, 0) / 8);

  // Demand for the skills already on the profile, counted across live roles.
  const skillDemand = seekerSummary.profile.skills
    .map((skill) => ({ skill, count: jobs.filter((job) => job.skills.includes(skill)).length }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count);
  const peakDemand = Math.max(1, ...skillDemand.map((row) => row.count));

  // Skills asked for in strong matches that the profile does not claim yet.
  const gaps = [...new Set(ranked.slice(0, 8).flatMap((job) => job.skills))]
    .filter((skill) => !seekerSummary.profile.skills.includes(skill))
    .map((skill) => ({ skill, count: jobs.filter((job) => job.skills.includes(skill)).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Match intelligence"
        title="AI job companion"
        description="A standing brief that scans every new role, explains why each one fits, and tells you what to fix."
        actionSlot={
          <Link
            href="/seeker/jobs"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface px-5 text-[15px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
          >
            Open job search <ArrowUpRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        }
      />

      <CompanionRun
        scanned={jobs.length}
        newMatches={ranked.filter((job) => job.matchScore >= 60).length}
        strongMatches={strongMatches}
        topRole={picks[0]?.title ?? "—"}
        topScore={picks[0]?.matchScore ?? 0}
      />

      <KpiStrip
        className="mt-6"
        items={[
          { label: "Average fit", value: `${averageMatch}%`, detail: "top eight roles", tone: "success", icon: Gauge },
          { label: "Above 85%", value: strongMatches, detail: "worth applying now", icon: Target, href: "/seeker/jobs?match=85" },
          { label: "Skills in demand", value: skillDemand.length, detail: "from your profile", icon: TrendingUp },
          { label: "Digest", value: "Mondays", detail: "07:00 GST", icon: Clock3 }
        ]}
      />

      <div className="mt-6 grid items-stretch gap-6 min-[1280px]:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <SectionPanel
          title="This week’s picks"
          description="Ranked by fit, with the reasons the companion used."
          bodyClassName="p-0"
          action={
            <Link href="/seeker/jobs" className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:text-ts-primary-deep">
              See all matches <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          }
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {picks.map((job, index) => (
              <li key={job.id} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="group relative flex flex-col gap-3 px-6 py-5 transition-colors hover:bg-ts-primary-tint/30 max-[680px]:px-4">
                  <div className="flex items-center gap-4">
                    <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-ts-md text-sm font-bold text-ts-ink/80" style={{ backgroundColor: job.accent }}>
                      {job.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link href={`/jobs/${job.id}`} className="block text-[15px] font-bold text-ts-ink after:absolute after:inset-0 group-hover:text-ts-primary-deep">
                        {job.title}
                      </Link>
                      <span className="mt-1 block truncate text-[13px] text-ts-muted">
                        {job.company} · {job.location} · {salaryLabel(job)}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-8 shrink-0 items-center rounded-full px-3 text-sm font-bold",
                        job.matchScore >= 85 ? "bg-ts-primary-tint text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
                      )}
                    >
                      {job.matchScore}%
                    </span>
                  </div>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0 ps-16 max-[680px]:ps-0">
                    {matchReasons(job).map((reason) => (
                      <li key={reason} className="inline-flex items-center gap-1.5 rounded-full bg-ts-surface-2 px-3 py-1.5 text-xs font-semibold text-ts-muted">
                        <Check size={12} aria-hidden="true" className="text-ts-primary" /> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel
          title="Your search brief"
          description="What the companion matches against. Edit any line."
          bodyClassName="flex flex-col gap-5"
        >
          <EditableField label="Target roles" storageKey={`${KEY}:roles`} defaultValue={BRIEF.targetRoles} />
          <EditableField label="Seniority" storageKey={`${KEY}:seniority`} defaultValue={BRIEF.seniority} options={["Mid", "Senior or Lead", "Lead", "Executive"]} />
          <EditableField label="Locations" storageKey={`${KEY}:locations`} defaultValue={BRIEF.locations} />
          <EditableField label="Work mode" storageKey={`${KEY}:mode`} defaultValue={BRIEF.mode} options={["On-site", "Hybrid", "Remote", "Hybrid or remote"]} />
          <EditableField label="Salary floor" storageKey={`${KEY}:salary`} defaultValue={`AED ${BRIEF.salaryFloor.toLocaleString()} / month`} />
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">Must-have skills</span>
            <EditableChips storageKey={`${KEY}:skills`} defaultItems={seekerSummary.companion.skills} addLabel="Add skill" />
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">Deal-breakers</span>
            <EditableChips storageKey={`${KEY}:dealbreakers`} defaultItems={["Full-time on-site", "Relocation outside GCC"]} addLabel="Add deal-breaker" />
          </div>
        </SectionPanel>
      </div>

      <div className="mt-6 grid items-stretch gap-6 min-[900px]:grid-cols-2 min-[1280px]:grid-cols-3">
        <SectionPanel title="Skill demand" description="How often your skills appear in live roles." bodyClassName="flex flex-col gap-4">
          <ul className="m-0 flex flex-1 list-none flex-col justify-center gap-3.5 p-0">
            {skillDemand.map((row) => (
              <li key={row.skill} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm font-semibold text-ts-ink">{row.skill}</span>
                <span aria-hidden="true" className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ts-surface-2">
                  <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${Math.max(6, (row.count / peakDemand) * 100)}%` }} />
                </span>
                <span className="w-14 shrink-0 text-end text-[13px] font-bold text-ts-ink">{row.count} roles</span>
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Worth adding" description="Asked for in your strongest matches, missing from your profile." bodyClassName="flex flex-col gap-4">
          <ul className="m-0 flex flex-1 list-none flex-col gap-2.5 p-0">
            {gaps.map((row) => (
              <li key={row.skill} className="flex items-center gap-3 rounded-ts-md border border-ts-line bg-ts-surface-2/50 px-4 py-3">
                <span className="min-w-0 flex-1 text-sm font-semibold text-ts-ink">{row.skill}</span>
                <span className="shrink-0 text-[13px] text-ts-muted">{row.count} roles</span>
              </li>
            ))}
          </ul>
          <Link
            href="/seeker/profile"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
          >
            Add these to your profile
          </Link>
        </SectionPanel>

        <SectionPanel title="Companion activity" description="What it did, and why your results changed." bodyClassName="p-0">
          <ol className="m-0 flex list-none flex-col p-0">
            {activity.map((entry, index) => (
              <li key={entry.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="flex items-start gap-3.5 px-6 py-4 max-[680px]:px-4">
                  <span aria-hidden="true" className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
                    <Sparkles size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ts-ink">{entry.title}</span>
                    <span className="block text-[13px] text-ts-muted">{entry.detail}</span>
                  </span>
                  <span className="shrink-0 text-xs whitespace-nowrap text-ts-muted">{entry.when}</span>
                </div>
              </li>
            ))}
          </ol>
        </SectionPanel>
      </div>

      <SectionPanel
        className="mt-6"
        title="Automation"
        description="What the companion is allowed to do on your behalf."
        bodyClassName="grid gap-4 p-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-4 max-[680px]:p-4"
      >
        <EditableToggle label="Weekly match digest" description="Every Monday at 07:00 GST" storageKey={`${KEY}:digest`} />
        <EditableToggle label="Instant alerts above 90%" description="Notify me the moment one appears" storageKey={`${KEY}:instant`} />
        <EditableToggle label="Salary movement alerts" description="When your target range shifts" storageKey={`${KEY}:salary-alerts`} defaultOn={false} />
        <EditableToggle label="Draft application notes" description="Prepare a first draft for easy applies" storageKey={`${KEY}:drafts`} defaultOn={false} />
      </SectionPanel>
    </>
  );
}

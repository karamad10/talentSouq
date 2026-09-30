import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CalendarClock, MapPin, SearchX, Users, Wallet } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { getJob } from "@/data/jobs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const job = getJob((await params).id);
  return { title: job ? `${job.title} · ${job.company}` : "Job no longer available" };
}

/**
 * A job opened from inside the workspace (recommendations, saved jobs, offers).
 * It reads the same data the workspace lists come from, so a job that is
 * listed can always be opened — and one that has gone shows that here, in the
 * workspace, instead of sending the seeker to the public site's 404.
 */
export default async function SeekerJobPage({ params }: { params: Promise<{ id: string }> }) {
  const job = getJob((await params).id);

  if (!job) {
    return (
      <>
        <BackLink />
        <EmptyState
          icon={SearchX}
          title="This job is no longer available"
          description="The employer closed or removed it. It has been taken out of your matches; anything you saved or applied to keeps its history."
          action={{ href: "/seeker/jobs", label: "Find similar roles" }}
        />
      </>
    );
  }

  const facts = [
    { icon: Wallet, label: "Salary", value: `${job.currency} ${Math.round(job.salaryMin / 1000)}k–${Math.round(job.salaryMax / 1000)}k / month` },
    { icon: BriefcaseBusiness, label: "Contract", value: `${job.type} · ${job.seniority}` },
    { icon: MapPin, label: "Location", value: `${job.location} · ${job.mode}` },
    { icon: CalendarClock, label: "Posted", value: job.posted },
    { icon: Users, label: "Applicants", value: String(job.applicants) }
  ];

  return (
    <>
      <BackLink />
      <WorkspaceHeader eyebrow={job.company} title={job.title} titleIsName description={job.summary} />

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 min-[1100px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SectionPanel title="Why it matches" description={`${job.matchScore}% fit with your profile.`}>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {job.skills.map((skill) => (
              <li key={skill} className="inline-flex h-8 items-center rounded-ts-xs bg-ts-surface-2 px-2.5 text-[13px] font-semibold text-ts-ink">
                {skill}
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Role details">
          <ul className="m-0 flex list-none flex-col p-0">
            {facts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <li key={fact.label} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <div className="flex items-center gap-3 py-3">
                    <Icon size={16} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                    <span className="w-28 shrink-0 text-[13px] text-ts-muted">{fact.label}</span>
                    <strong className="min-w-0 text-sm font-semibold text-ts-ink">{fact.value}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionPanel>
      </div>
    </>
  );
}

function BackLink() {
  return (
    <Link href="/seeker/jobs" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ts-muted hover:text-ts-ink">
      <ArrowLeft size={15} aria-hidden="true" className="rtl:-scale-x-100" /> Back to jobs
    </Link>
  );
}

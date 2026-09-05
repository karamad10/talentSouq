import { ArrowUpRight, UsersRound } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { PersonAvatar, ScoreBadge } from "@/components/workspace-ui";
import type { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

type Candidate = (typeof employerSummary.pipeline)[number];

export function RecentApplicants({ candidates }: { candidates: Candidate[] }) {
  if (candidates.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={UsersRound}
          title="No applicants yet"
          description="New applicants across your open roles will appear here."
          action={{ href: "/employer/jobs", label: "Manage jobs" }}
        />
      </div>
    );
  }
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {candidates.map((candidate, index) => (
        <li key={candidate.name} className={cn(index > 0 && "border-t border-ts-line-soft")}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5 transition-colors hover:bg-ts-surface-2/50 max-[680px]:px-4">
            <PersonAvatar name={candidate.name} />
            <div className="min-w-40 flex-1">
              <p className="m-0 truncate text-sm font-bold text-ts-ink">{candidate.name}</p>
              <p className="m-0 mt-0.5 text-[13px] text-ts-muted">{candidate.role}</p>
            </div>
            <StatusPill status={candidate.stage} className="shrink-0 px-2.5 py-0.5 text-[11px]" />
            <ScoreBadge value={candidate.score} />
            <Link
              href="/employer/pipeline"
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep"
            >
              Review <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

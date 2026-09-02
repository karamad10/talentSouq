import { ArrowUpRight, UsersRound } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import type { employerSummary } from "@/data/workspace";

type Candidate = (typeof employerSummary.pipeline)[number];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function RecentApplicants({ candidates }: { candidates: Candidate[] }) {
  if (candidates.length === 0) {
    return <EmptyState icon={UsersRound} title="No applicants yet" description="New applicants across your open roles will appear here." action={{ href: "/employer/jobs", label: "Manage jobs" }} />;
  }
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {candidates.map((candidate, index) => (
        <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
          <div className="flex items-center gap-3 py-2.5">
            <Avatar size="sm" initials={initialsOf(candidate.name)} className="bg-ts-primary-tint text-ts-primary-deep" />
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-semibold text-ts-ink">{candidate.name}</p>
              <p className="m-0 flex items-center gap-1.5 text-xs text-ts-muted">
                {candidate.role} · <StatusPill status={candidate.stage} />
              </p>
            </div>
            <span className="inline-flex h-6 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}%</span>
            <Link href="/employer/pipeline" className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">
              Review <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

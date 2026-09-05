import { FolderPlus, MapPin } from "lucide-react";
import { BookmarkToggle, PreviewActionButton } from "@/components/interaction-ui";
import { PersonAvatar, ScoreBadge } from "@/components/workspace-ui";
import type { employerSummary } from "@/data/workspace";

export type TalentProfile = (typeof employerSummary.candidates)[number];

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold tracking-[0.04em] text-ts-muted uppercase">{label}</dt>
      <dd className="m-0 mt-1 truncate text-[13px] font-semibold text-ts-ink">{value}</dd>
    </div>
  );
}

/**
 * One profile from the talent pool. The three facts an employer screens on —
 * when the person can start, what they expect to earn, and how recently they
 * were around — get their own band rather than competing inside the name row.
 */
export function TalentCard({ candidate }: { candidate: TalentProfile }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-ts-xl border border-ts-line-soft bg-ts-surface shadow-ts-card transition-colors hover:border-ts-line-soft">
      <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
        <PersonAvatar name={candidate.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 truncate text-[15px] leading-tight font-bold text-ts-ink">{candidate.name}</h3>
          <p className="m-0 mt-1 truncate text-[13px] text-ts-muted">{candidate.headline}</p>
          <p className="m-0 mt-1.5 flex items-center gap-1.5 text-[13px] text-ts-muted">
            <MapPin size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate">{candidate.location}</span>
          </p>
        </div>
        <ScoreBadge value={candidate.score} />
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pb-4">
        {candidate.skills.map((skill) => (
          <span key={skill} className="inline-flex h-6.5 items-center rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-muted">
            {skill}
          </span>
        ))}
      </div>

      <dl className="m-0 grid grid-cols-3 gap-3 border-y border-ts-line-soft bg-ts-surface-2/40 px-5 py-3.5">
        <Detail label="Available" value={candidate.availability} />
        <Detail label="Expects" value={candidate.desired} />
        <Detail label="Last seen" value={candidate.lastActive.replace("Active ", "")} />
      </dl>

      <div className="flex items-center gap-2 px-5 py-3.5">
        <PreviewActionButton
          type="button"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-ts-md bg-ts-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-ts-primary-deep"
          storageKey={`employer-invite-${candidate.name}`}
          successLabel="Invited"
        >
          Invite
        </PreviewActionButton>
        <PreviewActionButton
          type="button"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-line-soft hover:bg-ts-surface-2"
          storageKey={`employer-folder-${candidate.name}`}
          successLabel="Added"
        >
          <FolderPlus size={15} aria-hidden="true" /> Folder
        </PreviewActionButton>
        <BookmarkToggle
          storageKey={`employer-candidate-saved-${candidate.name}`}
          label={candidate.name}
          size={16}
          className="ms-auto grid size-10 shrink-0 place-items-center rounded-ts-md border border-ts-line-soft text-ts-muted transition-colors hover:border-ts-primary hover:text-ts-primary-deep aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
        />
      </div>
    </article>
  );
}

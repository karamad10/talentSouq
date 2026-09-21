import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { salaryLabel } from "@/components/dashboard/job-list";
import type { Job } from "@/data/jobs";
import type { Locale } from "@/lib/i18n";

/** Public listing card: identity, the facts that decide a click, one clear action. */
export function PublicJobCard({ job, locale = "en" }: { job: Job; locale?: Locale }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col gap-4 rounded-ts-xl border border-ts-line bg-ts-surface p-5 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/25 min-[560px]:p-6">
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md text-sm font-semibold text-ts-ink/75" style={{ backgroundColor: job.accent }}>
          {job.initials}
        </span>
        <span className="text-[13px] text-ts-subtle">{job.posted}</span>
      </div>

      <div className="min-w-0">
        <p className="m-0 text-[13px] font-semibold text-ts-primary-deep">{job.company}</p>
        <h3 className="m-0 mt-1.5 text-[17px] leading-snug font-semibold tracking-[-0.02em] text-ts-ink min-[560px]:text-[19px]">
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 group-hover:text-ts-primary-deep">
            {job.title}
          </Link>
        </h3>
        <p className="m-0 mt-2 flex items-center gap-1.5 text-sm text-ts-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" /> <span className="min-w-0 truncate">{job.location} · {job.mode}</span>
        </p>
      </div>

      <p className="m-0 line-clamp-2 text-sm leading-relaxed text-ts-muted">{job.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ts-line-soft pt-4 text-[13px] text-ts-muted">
        <span>{job.type}</span>
        <span aria-hidden="true" className="h-3 w-px bg-ts-line-soft" />
        <span>{salaryLabel(job)}</span>
        {job.easyApply ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-ts-accent-deep">
            <Zap size={13} aria-hidden="true" /> {locale === "ar" ? "تقديم سريع" : "Easy apply"}
          </span>
        ) : null}
        <span aria-hidden="true" className="ms-auto text-ts-subtle transition-colors group-hover:text-ts-primary">
          <ArrowUpRight size={18} className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  );
}

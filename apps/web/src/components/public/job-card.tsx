import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { salaryLabel } from "@/components/dashboard/job-list";
import type { Job } from "@/data/jobs";
import type { Locale } from "@/lib/i18n";

/** Public listing card: identity, the facts that decide a click, one clear action. */
export function PublicJobCard({ job, locale = "en" }: { job: Job; locale?: Locale }) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-6 transition-all hover:-translate-y-1 hover:border-ts-primary hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="grid size-13 shrink-0 place-items-center rounded-ts-md text-base font-bold text-ts-ink/80" style={{ backgroundColor: job.accent }}>
          {job.initials}
        </span>
        <span className="text-[13px] font-semibold text-ts-muted">{job.posted}</span>
      </div>

      <div className="min-w-0">
        <p className="m-0 text-[13px] font-bold text-ts-primary">{job.company}</p>
        <h3 className="m-0 mt-1.5 text-xl leading-snug font-bold tracking-[-0.02em] text-ts-ink">
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 group-hover:text-ts-primary-deep">
            {job.title}
          </Link>
        </h3>
        <p className="m-0 mt-2.5 flex items-center gap-1.5 text-sm text-ts-muted">
          <MapPin size={15} aria-hidden="true" /> {job.location} · {job.mode}
        </p>
      </div>

      <p className="m-0 line-clamp-2 text-sm leading-relaxed text-ts-muted">{job.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-ts-line pt-4">
        <span className="inline-flex h-8 items-center rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-muted">{job.type}</span>
        <span className="inline-flex h-8 items-center rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-muted">{salaryLabel(job)}</span>
        {job.easyApply ? (
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ts-accent-tint px-3 text-[13px] font-bold text-ts-accent-deep">
            <Zap size={13} aria-hidden="true" /> {locale === "ar" ? "تقديم سريع" : "Easy apply"}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="ms-auto grid size-10 place-items-center rounded-full border border-ts-line text-ts-muted transition-colors group-hover:border-ts-primary group-hover:bg-ts-primary-tint group-hover:text-ts-primary-deep"
        >
          <ArrowUpRight size={18} className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  );
}

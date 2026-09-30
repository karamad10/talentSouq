import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import type { PublicJob } from "@/data/public-jobs";
import type { Locale } from "@/lib/i18n";
import { employmentTypeLabel, postedLabel, salaryLabel, workModeLabel } from "@/lib/labels";

const ACCENTS = ["#e6f4f1", "#fdf1e6", "#eceff5", "#e6f2eb", "#f1f4f6"];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TS";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** A stable tint per company, so the same employer always gets the same well. */
export function accentFor(key: string): string {
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

export function companyName(job: Pick<PublicJob, "company">, locale: Locale): string {
  return job.company.name || (locale === "ar" ? "صاحب عمل على تالنت سوق" : "TalentSouq employer");
}

/** The Arabic title when the visitor reads Arabic and the employer wrote one. */
export function jobTitle(job: Pick<PublicJob, "title" | "titleAr">, locale: Locale): string {
  return locale === "ar" && job.titleAr ? job.titleAr : job.title;
}

const AVATAR_BOX = {
  sm: "size-7 rounded-ts-sm text-[11px]",
  md: "size-11 rounded-ts-md text-sm",
  lg: "size-20 rounded-ts-lg text-2xl"
} as const;

export function CompanyAvatar({ name, logoUrl, size = "md" }: { name: string; logoUrl: string | null; size?: keyof typeof AVATAR_BOX }) {
  const box = AVATAR_BOX[size];
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- employer logos live in Supabase Storage; no image loader is configured for it
    return <img src={logoUrl} alt="" className={`${box} shrink-0 border border-ts-line object-cover`} loading="lazy" />;
  }
  return (
    <span aria-hidden="true" className={`${box} grid shrink-0 place-items-center font-semibold text-ts-ink/75`} style={{ backgroundColor: accentFor(name) }}>
      {initialsOf(name)}
    </span>
  );
}

/** Public listing card: identity, the facts that decide a click, one clear action. */
export function PublicJobCard({ job, locale = "en" }: { job: PublicJob; locale?: Locale }) {
  const arabic = locale === "ar";
  const name = companyName(job, locale);
  const place = [job.location, workModeLabel(job.workMode, locale)].filter(Boolean).join(" · ");
  return (
    <article className="group relative flex h-full min-w-0 flex-col gap-4 rounded-ts-xl border border-ts-line bg-ts-surface p-5 transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/25 min-[560px]:p-6">
      <div className="flex items-start justify-between gap-3">
        <CompanyAvatar name={name} logoUrl={job.company.logoUrl} />
        <span className="text-[13px] text-ts-subtle">{postedLabel(job.createdAt, locale)}</span>
      </div>

      <div className="min-w-0">
        <p className="m-0 text-[13px] font-semibold text-ts-primary-deep">{name}</p>
        <h3 className="m-0 mt-1.5 text-[17px] leading-snug [unicode-bidi:plaintext] font-semibold tracking-[-0.02em] text-ts-ink min-[560px]:text-[19px]">
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 group-hover:text-ts-primary-deep">
            {jobTitle(job, locale)}
          </Link>
        </h3>
        {place ? (
          <p className="m-0 mt-2 flex items-center gap-1.5 text-sm text-ts-muted">
            <MapPin size={14} aria-hidden="true" className="shrink-0" /> <span className="min-w-0 truncate">{place}</span>
          </p>
        ) : null}
      </div>

      {job.summary ? <p className="m-0 line-clamp-2 text-sm leading-relaxed text-ts-muted [unicode-bidi:plaintext]">{job.summary}</p> : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ts-line-soft pt-4 text-[13px] text-ts-muted">
        {job.employmentType ? (
          <>
            <span>{employmentTypeLabel(job.employmentType, locale)}</span>
            <span aria-hidden="true" className="h-3 w-px bg-ts-line-soft" />
          </>
        ) : null}
        <span>{salaryLabel(job.salaryMin, job.salaryMax, job.currency, locale)}</span>
        {job.easyApply ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-ts-accent-deep">
            <Zap size={13} aria-hidden="true" /> {arabic ? "تقديم سريع" : "Easy apply"}
          </span>
        ) : null}
        <span aria-hidden="true" className="ms-auto text-ts-subtle transition-colors group-hover:text-ts-primary">
          <ArrowUpRight size={18} className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  );
}

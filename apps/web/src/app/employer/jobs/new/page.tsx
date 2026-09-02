import type { Metadata } from "next";
import { ArrowLeft, Info } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { buttonVariants } from "@/components/ui/button";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Post a job" };

const inputClass =
  "h-10 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3 text-sm text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary";
const labelClass = "flex flex-col gap-1.5 text-xs font-semibold text-ts-muted";

export default function NewJobPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Listings"
        title="Post a job"
        description="Describe the role once — the listing, response tracking, and pipeline are set up from it."
        actionSlot={
          <Link href={"/employer/jobs" as Route} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ts-muted transition-colors hover:text-ts-ink">
            <ArrowLeft size={14} aria-hidden="true" className="rtl:-scale-x-100" /> Back to jobs
          </Link>
        }
      />
      <div className="mx-auto max-w-3xl">
        <SectionPanel title="Role details" description="Fields marked * are required.">
          {/* GET round-trip: submitting lands on /employer/jobs?created=<title>. The
              Supabase mutation replaces this action when the backend is wired. */}
          <form action={"/employer/jobs" as Route} method="get" className="flex flex-col gap-4">
            <label className={labelClass}>
              Job title *
              <input required name="created" placeholder="e.g. Senior Product Designer" className={inputClass} />
            </label>
            <div className="grid grid-cols-2 gap-4 max-[680px]:grid-cols-1">
              <label className={labelClass}>
                Category *
                <select required name="new-category" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {seekerSummary.filters.categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Employment type *
                <select required name="new-type" defaultValue="Full-time" className={inputClass}>
                  {seekerSummary.filters.employmentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Work mode *
                <select required name="new-mode" defaultValue="Hybrid" className={inputClass}>
                  {seekerSummary.filters.workModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Country *
                <select required name="new-country" defaultValue="UAE" className={inputClass}>
                  {seekerSummary.filters.countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                City
                <input name="new-city" placeholder="e.g. Dubai" className={inputClass} />
              </label>
              <label className={labelClass}>
                Monthly salary band
                <select name="new-salary" defaultValue="" className={inputClass}>
                  <option value="">Prefer not to show</option>
                  {seekerSummary.filters.salary.map((band) => (
                    <option key={band}>{band}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className={labelClass}>
              Role description *
              <textarea
                required
                name="new-description"
                rows={6}
                placeholder="What the role owns, who it works with, and what success looks like."
                className="w-full resize-y rounded-ts-md border border-ts-field bg-ts-surface px-3 py-2.5 text-sm leading-relaxed text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
              />
            </label>
            <label className={labelClass}>
              Application deadline
              <input name="new-deadline" type="date" className={cn(inputClass, "max-w-56")} />
            </label>
            <p className="m-0 flex items-start gap-2 rounded-ts-md bg-ts-surface-2/60 p-3 text-xs leading-relaxed text-ts-muted">
              <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              Preview environment: submitting creates a local draft confirmation. Publishing, featured listings, and plan limits (Free: 2 active jobs)
              connect with the production backend.
            </p>
            <div className="flex items-center gap-2 border-t border-ts-line pt-4">
              <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-10 rounded-ts-md px-5 text-[13px]")}>
                Create draft
              </button>
              <Link href={"/employer/jobs" as Route} className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-10 rounded-ts-md px-4 text-[13px]")}>
                Cancel
              </Link>
            </div>
          </form>
        </SectionPanel>
      </div>
    </>
  );
}

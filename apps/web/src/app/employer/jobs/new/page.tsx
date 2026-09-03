import type { Metadata } from "next";
import { ArrowLeft, Info } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { buttonVariants } from "@/components/ui/button";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { workspaceFilters } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Post a job" };

const inputClass =
  "h-12 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3.5 text-sm text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary";
const labelClass = "flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase";

export default function NewJobPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Listings"
        title="Post a job"
        description="Describe the role once — the listing, response tracking, and pipeline are set up from it."
        actionSlot={
          <Link
            href={"/employer/jobs" as Route}
            className="inline-flex h-12 items-center gap-2 rounded-ts-md border border-ts-line bg-ts-surface px-5 text-[15px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
          >
            <ArrowLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" /> Back to jobs
          </Link>
        }
      />
      <div className="mx-auto w-full max-w-4xl">
        <SectionPanel title="Role details" description="Fields marked * are required.">
          {/* GET round-trip: submitting lands on /employer/jobs?created=<title>. The
              Supabase mutation replaces this action when the backend is wired. */}
          <form action={"/employer/jobs" as Route} method="get" className="flex flex-col gap-5">
            <label className={labelClass}>
              Job title *
              <input required name="created" placeholder="e.g. Senior Product Designer" className={inputClass} />
            </label>
            <div className="grid grid-cols-2 gap-5 max-[680px]:grid-cols-1">
              <label className={labelClass}>
                Category *
                <select required name="new-category" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {workspaceFilters.categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Employment type *
                <select required name="new-type" defaultValue="Full-time" className={inputClass}>
                  {workspaceFilters.employmentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Work mode *
                <select required name="new-mode" defaultValue="Hybrid" className={inputClass}>
                  {workspaceFilters.workModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Country *
                <select required name="new-country" defaultValue="UAE" className={inputClass}>
                  {workspaceFilters.countries.map((country) => (
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
                  {workspaceFilters.salary.map((band) => (
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
                rows={8}
                placeholder="What the role owns, who it works with, and what success looks like."
                className="w-full resize-y rounded-ts-md border border-ts-field bg-ts-surface px-3.5 py-3 text-sm leading-relaxed text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
              />
            </label>
            <label className={labelClass}>
              Application deadline
              <input name="new-deadline" type="date" className={cn(inputClass, "max-w-56")} />
            </label>
            <p className="m-0 flex items-start gap-2.5 rounded-ts-md bg-ts-surface-2/60 p-4 text-[13px] leading-relaxed text-ts-muted">
              <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              Preview environment: submitting creates a local draft confirmation. Publishing, featured listings, and plan limits (Free: 2 active jobs)
              connect with the production backend.
            </p>
            <div className="flex items-center gap-3 border-t border-ts-line pt-5">
              <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-6 text-sm")}>
                Create draft
              </button>
              <Link href={"/employer/jobs" as Route} className={cn(buttonVariants({ tone: "secondary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-sm")}>
                Cancel
              </Link>
            </div>
          </form>
        </SectionPanel>
      </div>
    </>
  );
}

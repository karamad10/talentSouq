import type { Metadata } from "next";
import { FileText, MapPin, Pencil, UserRound } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { Ring } from "@/components/ui/ring";
import { InfoList, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "My profile" };

export default function SeekerProfilePage() {
  const profile = seekerSummary.profile;
  return (
    <>
      <WorkspaceHeader
        eyebrow="Personal profile"
        title={seekerSummary.name}
        description="This is your person profile: experience, education, skills, CV, preferences, and public career identity."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
            storageKey="seeker-profile-edit"
            successLabel="Saved"
          >
            Edit profile
          </PreviewActionButton>
        }
      />
      <section className="mb-4 flex flex-wrap items-center gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-4">
        <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-ts-primary-deep">
          <UserRound size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-base font-semibold text-ts-ink">{profile.headline}</h2>
          <p className="m-0 mt-0.5 flex items-center gap-1.5 text-[13px] text-ts-muted">
            <MapPin size={14} aria-hidden="true" /> {seekerSummary.location} · {seekerSummary.availability}
          </p>
          <p className="m-0 mt-0.5 text-xs text-ts-muted">
            {profile.followers} followers · {profile.following} following
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Ring value={profile.completeness} size={56} label="Profile completeness" />
          <span className="max-w-24 text-xs font-semibold text-ts-muted">Profile complete</span>
        </div>
      </section>
      <div className="grid items-start gap-4 min-[981px]:grid-cols-2">
        <SectionPanel
          title="About"
          action={
            <PreviewActionButton
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-ts-md px-2 text-[13px] font-semibold text-ts-primary transition-colors hover:bg-ts-surface-2"
              storageKey="seeker-profile-about-edit"
              successLabel="Saved"
            >
              <Pencil size={13} aria-hidden="true" /> Edit
            </PreviewActionButton>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-ts-ink">
            Product designer focused on commerce, design systems, and thoughtful experiences for teams across the Gulf.
          </p>
        </SectionPanel>
        <SectionPanel
          title="CV / résumé"
          action={
            <PreviewActionButton
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-ts-md px-2 text-[13px] font-semibold text-ts-primary transition-colors hover:bg-ts-surface-2"
              storageKey="seeker-profile-cv-replace"
              successLabel="Uploaded"
            >
              Replace
            </PreviewActionButton>
          }
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-surface-2 text-ts-muted">
              <FileText size={17} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[13px] font-semibold text-ts-ink">Sarah-Ahmed-CV.pdf</strong>
              <p className="m-0 truncate text-xs text-ts-muted">{profile.cvStatus}</p>
            </div>
            <PreviewActionButton
              type="button"
              className="inline-flex h-8 items-center rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
              storageKey="seeker-profile-cv-view"
              successLabel="Opened"
            >
              View
            </PreviewActionButton>
          </div>
        </SectionPanel>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 max-[981px]:grid-cols-2 max-[680px]:grid-cols-1">
        <InfoList title="Experience" values={profile.experience} />
        <InfoList title="Education" values={profile.education} />
        <InfoList title="Skills" values={profile.skills} />
        <InfoList title="Languages" values={profile.languages} />
        <InfoList title="Certifications & licenses" values={profile.certifications} />
        <InfoList title="Links" values={["LinkedIn", "Portfolio", "GitHub"]} />
      </div>
      <SectionPanel
        className="mt-4"
        title="Personal details & job preferences"
        description="Nationality, visa, salary, relocation, driving license, and profile visibility are managed separately from the company profile."
      >
        <div className="grid grid-cols-4 gap-3 max-[981px]:grid-cols-2 max-[680px]:grid-cols-1">
          {[
            { label: "Desired salary", value: "AED 28,000 / month" },
            { label: "Visa status", value: "UAE resident" },
            { label: "Relocation", value: "Open to relocate" },
            { label: "Driving license", value: "Yes" }
          ].map((row) => (
            <div key={row.label} className="rounded-ts-md bg-ts-surface-2/60 p-3">
              <span className="block text-xs font-semibold text-ts-muted">{row.label}</span>
              <strong className="mt-0.5 block text-[13px] font-semibold text-ts-ink">{row.value}</strong>
            </div>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}

import type { Metadata } from "next";
import { Building2, Globe2, MapPin, Pencil } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { Ring } from "@/components/ui/ring";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Company profile" };

export default function CompanyProfilePage() {
  const company = employerSummary.company;
  return (
    <>
      <WorkspaceHeader
        eyebrow="Company profile"
        title={employerSummary.organization}
        description="This is the employer organization profile: public brand, company details, contact information, media, and hiring identity."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
            storageKey="employer-company-edit"
            successLabel="Saved"
          >
            Edit company
          </PreviewActionButton>
        }
      />
      <section className="mb-4 flex flex-wrap items-center gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-4">
        <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-lg font-bold text-ts-primary-deep">
          NC
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-base font-semibold text-ts-ink">{company.industry}</h2>
          <p className="m-0 mt-0.5 flex items-center gap-1.5 text-[13px] text-ts-muted">
            <MapPin size={14} aria-hidden="true" /> {company.location} · {company.size}
          </p>
          <p className="m-0 mt-0.5 text-xs text-ts-muted">
            {company.followers.toLocaleString()} followers · {company.following} following
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Ring value={company.completeness} size={56} label="Company profile completeness" />
          <span className="max-w-28 text-xs font-semibold text-ts-muted">Company profile complete</span>
        </div>
      </section>
      <div className="grid items-start gap-4 min-[981px]:grid-cols-2">
        <SectionPanel
          title="About"
          action={
            <PreviewActionButton
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-ts-md px-2 text-[13px] font-semibold text-ts-primary transition-colors hover:bg-ts-surface-2"
              storageKey="employer-company-about-edit"
              successLabel="Saved"
            >
              <Pencil size={13} aria-hidden="true" /> Edit
            </PreviewActionButton>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-ts-ink">{company.description}</p>
        </SectionPanel>
        <SectionPanel title="Company details">
          <ul className="m-0 flex list-none flex-col p-0">
            {[
              { icon: Building2, label: "Size", value: company.size },
              { icon: Globe2, label: "Website", value: company.website },
              { icon: MapPin, label: "Headquarters", value: company.location }
            ].map((row, index) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <div className="flex items-center gap-3 py-2.5">
                    <Icon size={15} aria-hidden="true" className="shrink-0 text-ts-subtle" />
                    <span className="w-28 text-xs font-semibold text-ts-muted">{row.label}</span>
                    <strong className="min-w-0 truncate text-[13px] font-semibold text-ts-ink">{row.value}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionPanel>
      </div>
      <SectionPanel
        className="mt-4"
        title="Brand and media"
        description="Logo, cover image, gallery, public posts, contact details, and social links are managed here."
      >
        <div className="flex flex-col items-center gap-2 rounded-ts-md border border-dashed border-ts-line px-6 py-8 text-center">
          <Building2 size={24} aria-hidden="true" className="text-ts-muted" />
          <strong className="text-sm font-semibold text-ts-ink">Company media library</strong>
          <p className="m-0 max-w-96 text-[13px] leading-relaxed text-ts-muted">
            Add workplace photos, team imagery, and brand assets to strengthen the public employer profile.
          </p>
          <PreviewActionButton
            type="button"
            className="inline-flex h-8 items-center rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
            storageKey="employer-company-media"
            successLabel="Opened"
          >
            Manage media
          </PreviewActionButton>
        </div>
      </SectionPanel>
    </>
  );
}

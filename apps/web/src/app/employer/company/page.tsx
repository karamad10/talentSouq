import type { Metadata } from "next";
import { Building2, Eye, Globe2, ImagePlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EditableChips, EditableField, EditableList, EditableToggle } from "@/components/dashboard/profile-editing";
import { PreviewActionButton } from "@/components/interaction-ui";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Ring } from "@/components/ui/ring";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Company profile" };

const KEY = "talentsouq:employer:company";

export default function CompanyProfilePage() {
  const company = employerSummary.company;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Company profile"
        title={employerSummary.organization}
        description="Your public employer brand: everything here is editable and is what candidates see on your listings."
        actionSlot={
          <Link
            href="/employer/jobs/new"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md bg-ts-primary px-5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Post a job
          </Link>
        }
      />

      {/* Identity card: what a candidate reads first, all editable in place. */}
      <section className="flex flex-wrap items-center gap-6 rounded-ts-lg border border-ts-line bg-ts-surface p-6 max-[680px]:p-4">
        <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-ts-lg bg-ts-primary-tint text-2xl font-bold text-ts-primary-deep">
          NC
        </span>
        <div className="min-w-70 flex-1">
          <h2 className="m-0 text-[26px] leading-tight font-bold tracking-[-0.025em] text-ts-ink">{employerSummary.organization}</h2>
          <div className="mt-3 flex max-w-2xl flex-col gap-3">
            <EditableField label="Industry" storageKey={`${KEY}:industry`} defaultValue={company.industry} valueClassName="text-[15px] font-semibold" layout="inline" />
            <EditableField
              label="Headquarters & size"
              storageKey={`${KEY}:location`}
              defaultValue={`${company.location} · ${company.size}`}
              valueClassName="text-sm font-medium text-ts-muted"
              layout="inline"
            />
          </div>
          <p className="m-0 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ts-muted">
            <span>{company.followers.toLocaleString()} followers</span>
            <span>{company.following} following</span>
            <span>{employerSummary.openRoles} open roles</span>
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-ts-md bg-ts-surface-2/60 p-4">
          <Ring value={company.completeness} size={84} strokeWidth={8} label="Company profile completeness" valueClassName="text-base font-bold" />
          <div className="max-w-40">
            <strong className="block text-sm font-bold text-ts-ink">Profile complete</strong>
            <span className="block text-[13px] text-ts-muted">Add workplace photos to reach 100%.</span>
          </div>
        </div>
      </section>

      <KpiStrip
        className="mt-6"
        items={[
          { label: "Profile views", value: 1240, detail: "+8% this month", tone: "success", icon: Eye },
          { label: "Followers", value: company.followers.toLocaleString(), detail: "candidates tracking you", icon: UsersRound },
          { label: "Open roles", value: employerSummary.openRoles, detail: "listed publicly", icon: Building2, href: "/employer/jobs" },
          { label: "Applicants this week", value: employerSummary.newApplicants, detail: "from the public profile", icon: Globe2, href: "/employer/pipeline" }
        ]}
      />

      <div className="mt-6 grid items-start gap-6 min-[1180px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <SectionPanel title="About" description="What the company does, in two or three sentences.">
            <EditableField
              label="Description"
              storageKey={`${KEY}:about`}
              multiline
              defaultValue={company.description}
              valueClassName="text-[15px] leading-relaxed font-normal"
            />
          </SectionPanel>

          <SectionPanel title="Why people join" description="The lines candidates see on every listing.">
            <EditableList
              storageKey={`${KEY}:values`}
              defaultItems={[
                "Small teams with real ownership of their product area",
                "Hybrid by default — three days in the Dubai studio",
                "Learning budget and conference time for every engineer and designer"
              ]}
              addLabel="Add a reason"
              placeholder="One sentence a candidate should read"
            />
          </SectionPanel>

          <SectionPanel title="Benefits" description="Shown as chips on your public profile.">
            <EditableChips
              storageKey={`${KEY}:benefits`}
              defaultItems={["Family health cover", "25 days leave", "Learning budget", "Annual flights home", "Hybrid working"]}
              addLabel="Add benefit"
            />
          </SectionPanel>

          <SectionPanel title="Offices" description="Where the team actually sits.">
            <EditableList
              storageKey={`${KEY}:offices`}
              defaultItems={["Dubai, UAE · Headquarters", "Riyadh, KSA · Commercial team"]}
              addLabel="Add an office"
              placeholder="City, country · what happens there"
            />
          </SectionPanel>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <SectionPanel title="Company details" description="Used across your listings and invoices." bodyClassName="grid gap-5 p-6 min-[560px]:grid-cols-2 max-[680px]:p-4">
            <EditableField label="Company size" storageKey={`${KEY}:size`} defaultValue={company.size} options={["1–50 employees", "51–200 employees", "201–500 employees", "501+ employees"]} />
            <EditableField label="Website" storageKey={`${KEY}:website`} defaultValue={company.website} />
            <EditableField label="Founded" storageKey={`${KEY}:founded`} defaultValue="2018" />
            <EditableField label="Trade licence" storageKey={`${KEY}:licence`} defaultValue="DED 1029384" />
          </SectionPanel>

          <SectionPanel title="Contact" description="Where candidates and TalentSouq reach you." bodyClassName="grid gap-5 p-6 min-[560px]:grid-cols-2 max-[680px]:p-4">
            <EditableField label="Careers email" storageKey={`${KEY}:email`} defaultValue="careers@nexacommerce.example" />
            <EditableField label="Phone" storageKey={`${KEY}:phone`} defaultValue="+971 4 000 0000" />
            <EditableField label="LinkedIn" storageKey={`${KEY}:linkedin`} defaultValue="linkedin.com/company/nexa-commerce" />
            <EditableField label="Careers page" storageKey={`${KEY}:careers`} defaultValue="nexacommerce.example/careers" />
          </SectionPanel>

          <SectionPanel title="Public visibility" description="Control what shows on the employer profile." bodyClassName="flex flex-col gap-3 p-6 max-[680px]:p-4">
            <EditableToggle label="Show company profile publicly" description="Appears in search and on every listing" storageKey={`${KEY}:public`} />
            <EditableToggle label="Show team members" description="Recruiter names on job posts" storageKey={`${KEY}:show-team`} />
            <EditableToggle label="Show salary ranges" description="On listings where a band is set" storageKey={`${KEY}:show-salary`} defaultOn={false} />
          </SectionPanel>

          <SectionPanel title="Brand & media" description="Logo, cover image, and workplace photos.">
            <div className="flex flex-col items-center gap-3 rounded-ts-md border border-dashed border-ts-line px-6 py-8 text-center">
              <ImagePlus size={26} aria-hidden="true" className="text-ts-muted" />
              <strong className="text-[15px] font-bold text-ts-ink">No photos yet</strong>
              <p className="m-0 max-w-96 text-[13px] leading-relaxed text-ts-muted">
                Workplace photos lift application rates — profiles with images get roughly a third more applicants.
              </p>
              <PreviewActionButton
                type="button"
                className="inline-flex h-11 items-center rounded-ts-md border border-ts-line bg-ts-surface px-4 text-sm font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                storageKey="employer-company-media"
                successLabel="Upload opened"
              >
                Upload media
              </PreviewActionButton>
            </div>
          </SectionPanel>
        </div>
      </div>
    </>
  );
}

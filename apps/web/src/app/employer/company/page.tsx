import type { Metadata } from "next";
import { Building2, Eye, Globe2, ImagePlus, UsersRound } from "lucide-react";
import type { Route } from "next";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EditableChips, EditableField, EditableList, EditableToggle } from "@/components/dashboard/profile-editing";
import { PreviewActionButton } from "@/components/interaction-ui";
import { MetricCards } from "@/components/ui/metric-cards";
import { Ring } from "@/components/ui/ring";
import { HeaderAction, HeaderActions, PageBody, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
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
          <HeaderActions>
            <HeaderAction href={"/companies/nexa-commerce" as Route}>View public page</HeaderAction>
            <HeaderAction href="/employer/jobs/new" tone="primary">
              Post a job
            </HeaderAction>
          </HeaderActions>
        }
      />

      <PageBody>
        {/* Identity card: what a candidate reads first, all editable in place. */}
        <section className="flex flex-wrap items-center gap-6 rounded-ts-xl border border-ts-line-soft bg-ts-surface p-6 shadow-ts-card max-[680px]:p-5">
          <span aria-hidden="true" className="grid size-18 shrink-0 place-items-center rounded-ts-lg bg-ts-primary-tint text-xl font-bold text-ts-primary-deep">
            NC
          </span>
          {/* No company name here: the page title directly above already is it. */}
          <div className="min-w-70 flex-1">
            <div className="flex max-w-md flex-col gap-2.5">
              <EditableField label="Industry" storageKey={`${KEY}:industry`} defaultValue={company.industry} valueClassName="text-sm font-semibold" layout="inline" />
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
            <Ring value={company.completeness} size={76} strokeWidth={8} label="Company profile completeness" valueClassName="text-[15px] font-bold" />
            <div className="max-w-40">
              <strong className="block text-sm font-bold text-ts-ink">Profile complete</strong>
              <span className="block text-[13px] text-ts-muted">Add workplace photos to reach 100%.</span>
            </div>
          </div>
        </section>

        <MetricCards
          items={[
            { label: "Profile views", value: "1,240", detail: "+8% this month", tone: "success", icon: Eye },
            { label: "Followers", value: company.followers.toLocaleString(), detail: "candidates tracking you", icon: UsersRound },
            { label: "Open roles", value: employerSummary.openRoles, detail: "listed publicly", icon: Building2, href: "/employer/jobs" },
            { label: "Applicants this week", value: employerSummary.newApplicants, detail: "from the public profile", icon: Globe2, href: "/employer/pipeline" }
          ]}
        />

        <SplitLayout
          rail={
            <>
              <SectionPanel title="Company details" bodyClassName="grid gap-5 p-6 max-[680px]:p-5" flush>
                <EditableField
                  label="Company size"
                  storageKey={`${KEY}:size`}
                  defaultValue={company.size}
                  options={["1–50 employees", "51–200 employees", "201–500 employees", "501+ employees"]}
                />
                <EditableField label="Website" storageKey={`${KEY}:website`} defaultValue={company.website} />
                <EditableField label="Founded" storageKey={`${KEY}:founded`} defaultValue="2018" />
                <EditableField label="Trade licence" storageKey={`${KEY}:licence`} defaultValue="DED 1029384" />
              </SectionPanel>

              <SectionPanel title="Contact" bodyClassName="grid gap-5 p-6 max-[680px]:p-5" flush>
                <EditableField label="Careers email" storageKey={`${KEY}:email`} defaultValue="careers@nexacommerce.example" />
                <EditableField label="Phone" storageKey={`${KEY}:phone`} defaultValue="+971 4 000 0000" />
                <EditableField label="LinkedIn" storageKey={`${KEY}:linkedin`} defaultValue="linkedin.com/company/nexa-commerce" />
                <EditableField label="Careers page" storageKey={`${KEY}:careers`} defaultValue="nexacommerce.example/careers" />
              </SectionPanel>

              <SectionPanel title="Public visibility" description="Control what shows on the employer profile." bodyClassName="flex flex-col gap-3" flush>
                <EditableToggle label="Show company profile publicly" description="Appears in search and on every listing" storageKey={`${KEY}:public`} />
                <EditableToggle label="Show team members" description="Recruiter names on job posts" storageKey={`${KEY}:show-team`} />
                <EditableToggle label="Show salary ranges" description="On listings where a band is set" storageKey={`${KEY}:show-salary`} defaultOn={false} />
              </SectionPanel>
            </>
          }
        >
          <SectionPanel title="About" description="What the company does, in two or three sentences." flush>
            <EditableField
              label="Description"
              storageKey={`${KEY}:about`}
              multiline
              defaultValue={company.description}
              valueClassName="text-sm leading-relaxed font-normal"
            />
          </SectionPanel>

          <SectionPanel title="Why people join" description="The lines candidates see on every listing." flush>
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

          <SectionPanel title="Benefits" description="Shown as chips on your public profile." flush>
            <EditableChips
              storageKey={`${KEY}:benefits`}
              defaultItems={["Family health cover", "25 days leave", "Learning budget", "Annual flights home", "Hybrid working"]}
              addLabel="Add benefit"
            />
          </SectionPanel>

          <SectionPanel title="Offices" description="Where the team actually sits." flush>
            <EditableList
              storageKey={`${KEY}:offices`}
              defaultItems={["Dubai, UAE · Headquarters", "Riyadh, KSA · Commercial team"]}
              addLabel="Add an office"
              placeholder="City, country · what happens there"
            />
          </SectionPanel>

          <SectionPanel title="Brand & media" description="Logo, cover image, and workplace photos." flush>
            <div className="flex flex-col items-center gap-3 rounded-ts-md border border-dashed border-ts-line-soft px-6 py-8 text-center">
              <ImagePlus size={24} aria-hidden="true" className="text-ts-muted" />
              <strong className="text-sm font-bold text-ts-ink">No photos yet</strong>
              <p className="m-0 max-w-96 text-[13px] leading-relaxed text-ts-muted">
                Workplace photos lift application rates — profiles with images get roughly a third more applicants.
              </p>
              <PreviewActionButton
                type="button"
                className="inline-flex h-10 items-center rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                storageKey="employer-company-media"
                successLabel="Upload opened"
              >
                Upload media
              </PreviewActionButton>
            </div>
          </SectionPanel>
        </SplitLayout>
      </PageBody>
    </>
  );
}

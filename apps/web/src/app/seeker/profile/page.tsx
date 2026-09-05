import type { Metadata } from "next";
import { Eye, MapPin, MessageSquare, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EditableChips, EditableField, EditableList, EditableToggle } from "@/components/dashboard/profile-editing";
import { CvManager } from "@/components/interaction-ui";
import { MetricCards } from "@/components/ui/metric-cards";
import { Ring } from "@/components/ui/ring";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "My profile" };

const KEY = "talentsouq:seeker:profile";

export default function SeekerProfilePage() {
  const profile = seekerSummary.profile;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Personal profile"
        title={seekerSummary.name}
        description="Everything on this page is editable and is what employers see when they open your profile."
        actionSlot={
          <Link
            href="/seeker/jobs"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md bg-ts-primary px-5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            <Sparkles size={16} aria-hidden="true" /> Find matching roles
          </Link>
        }
      />

      {/* Identity card: the four things a recruiter reads first, all editable. */}
      <section className="flex flex-wrap items-center gap-6 rounded-ts-lg border border-ts-line-soft bg-ts-surface p-6 max-[680px]:p-4">
        <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-2xl font-bold text-ts-primary-deep">
          <UserRound size={34} />
        </span>
        <div className="min-w-70 flex-1">
          <h2 className="m-0 text-[26px] leading-tight font-bold tracking-[-0.025em] text-ts-ink">{seekerSummary.name}</h2>
          <div className="mt-3 flex max-w-2xl flex-col gap-3">
            <EditableField label="Headline" storageKey={`${KEY}:headline`} defaultValue={profile.headline} valueClassName="text-[15px] font-semibold" layout="inline" />
            <EditableField
              label="Location & availability"
              storageKey={`${KEY}:location`}
              defaultValue={`${seekerSummary.location} · ${seekerSummary.availability}`}
              valueClassName="text-sm font-medium text-ts-muted"
              layout="inline"
            />
          </div>
          <p className="m-0 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ts-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" /> {seekerSummary.location}
            </span>
            <span>{profile.followers} followers</span>
            <span>{profile.following} following</span>
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-ts-md bg-ts-surface-2/60 p-4">
          <Ring value={profile.completeness} size={84} strokeWidth={8} label="Profile completeness" valueClassName="text-base font-bold" />
          <div className="max-w-40">
            <strong className="block text-sm font-bold text-ts-ink">Profile complete</strong>
            <span className="block text-[13px] text-ts-muted">Add a portfolio link to reach 100%.</span>
          </div>
        </div>
      </section>

      <MetricCards
        className="mt-6"
        items={[
          { label: "Profile views", value: seekerSummary.weeklyViews, detail: "+12% this week", tone: "success", icon: Eye },
          { label: "Response rate", value: `${seekerSummary.responseRate}%`, detail: "employers replying", icon: MessageSquare, href: "/seeker/messages" },
          { label: "Search visibility", value: `${seekerSummary.visibility}%`, detail: "in recruiter results", icon: ShieldCheck },
          { label: "Match quality", value: `${seekerSummary.matchScore}%`, detail: "average on new roles", icon: Sparkles, href: "/seeker/jobs" }
        ]}
      />

      <div className="mt-6 grid items-start gap-6 min-[1180px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <SectionPanel title="About" description="Two or three sentences on what you do and what you are looking for.">
            <EditableField
              label="Summary"
              storageKey={`${KEY}:about`}
              multiline
              defaultValue="Product designer focused on commerce, design systems, and thoughtful experiences for teams across the Gulf. I like turning messy operational problems into calm, usable products."
              valueClassName="text-[15px] leading-relaxed font-normal"
            />
          </SectionPanel>

          <SectionPanel title="Experience" description="Most recent first — role, company, and dates.">
            <EditableList
              storageKey={`${KEY}:experience`}
              defaultItems={[
                "Lead Product Designer · SouqOps · 2022–present",
                "Product Designer · Northstar Mobility · 2019–2022",
                "Junior Designer · Cedar Labs · 2017–2019"
              ]}
              addLabel="Add a role"
              placeholder="Role · Company · Years"
            />
          </SectionPanel>

          <SectionPanel title="Education" description="Degrees, diplomas, and courses.">
            <EditableList
              storageKey={`${KEY}:education`}
              defaultItems={profile.education}
              addLabel="Add education"
              placeholder="Qualification · Institution · Year"
            />
          </SectionPanel>

          <SectionPanel title="Certifications & licenses">
            <EditableList storageKey={`${KEY}:certifications`} defaultItems={profile.certifications} addLabel="Add a certification" placeholder="Certificate · Issuer · Year" />
          </SectionPanel>

          <SectionPanel title="Links" description="Portfolio, LinkedIn, and anything else worth showing.">
            <EditableList
              storageKey={`${KEY}:links`}
              defaultItems={["Portfolio · sarah.design", "LinkedIn · linkedin.com/in/sarahahmed"]}
              addLabel="Add a link"
              placeholder="Label · URL"
            />
          </SectionPanel>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <SectionPanel title="CV / résumé" description="Parsed automatically to keep your profile current.">
            <CvManager storageKey="seeker-profile-cv" defaultFileName="Sarah-Ahmed-CV.pdf" defaultStatus={profile.cvStatus} />
          </SectionPanel>

          <SectionPanel title="Skills" description="The first six appear on your public profile.">
            <EditableChips storageKey={`${KEY}:skills`} defaultItems={profile.skills} addLabel="Add skill" />
          </SectionPanel>

          <SectionPanel title="Languages">
            <EditableChips storageKey={`${KEY}:languages`} defaultItems={profile.languages} addLabel="Add language" />
          </SectionPanel>

          <SectionPanel title="Job preferences" description="Used to rank matches and filter your alerts." bodyClassName="grid gap-5 p-6 min-[560px]:grid-cols-2 max-[680px]:p-4">
            <EditableField label="Desired salary" storageKey={`${KEY}:salary`} defaultValue="AED 28,000 / month" />
            <EditableField label="Work mode" storageKey={`${KEY}:mode`} defaultValue="Hybrid or remote" options={["On-site", "Hybrid", "Remote", "Hybrid or remote"]} />
            <EditableField label="Notice period" storageKey={`${KEY}:notice`} defaultValue="30 days" options={["Immediate", "15 days", "30 days", "60 days", "90 days"]} />
            <EditableField label="Open to relocation" storageKey={`${KEY}:relocation`} defaultValue="Yes, within the GCC" options={["Not right now", "Yes, within the GCC", "Yes, anywhere"]} />
          </SectionPanel>

          <SectionPanel title="Personal details" description="Only shared with employers you apply to." bodyClassName="grid gap-5 p-6 min-[560px]:grid-cols-2 max-[680px]:p-4">
            <EditableField label="Nationality" storageKey={`${KEY}:nationality`} defaultValue="Jordanian" />
            <EditableField label="Visa status" storageKey={`${KEY}:visa`} defaultValue="UAE resident" options={["UAE resident", "Visit visa", "Needs sponsorship", "GCC national"]} />
            <EditableField label="Driving license" storageKey={`${KEY}:license`} defaultValue="Yes · UAE" options={["Yes · UAE", "Yes · international", "No"]} />
            <EditableField label="Date of birth" storageKey={`${KEY}:dob`} defaultValue="March 1992" />
          </SectionPanel>

          <SectionPanel title="Visibility" description="Control who can find and contact you." bodyClassName="flex flex-col gap-3 p-6 max-[680px]:p-4">
            <EditableToggle label="Searchable by employers" description="Appear in recruiter CV searches" storageKey={`${KEY}:visible`} />
            <EditableToggle label="Show current employer" description="Hide it to search discreetly" storageKey={`${KEY}:show-employer`} defaultOn={false} />
            <EditableToggle label="Open to offers badge" description="Shown on your public profile" storageKey={`${KEY}:open-to-offers`} />
          </SectionPanel>
        </div>
      </div>
    </>
  );
}

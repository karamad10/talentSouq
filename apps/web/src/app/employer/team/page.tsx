import type { Metadata } from "next";
import { ShieldCheck, UserPlus } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Team and permissions" };

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function TeamPage() {
  return (
    <>
      <WorkspaceHeader eyebrow="Organization access" title="Team & permissions" description="Invite colleagues and control company-level hiring permissions." />
      <SectionPanel title="Members" description={`${employerSummary.plan.seats} seats used · Owner, recruiter, hiring manager, and viewer roles stay organization-scoped.`}>
        <ul className="m-0 flex list-none flex-col p-0">
          {employerSummary.members.map((member, index) => (
            <li key={member.email} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex flex-wrap items-center gap-3 py-2.5">
                <Avatar size="sm" initials={initialsOf(member.name)} className="bg-ts-primary-tint text-ts-primary-deep" />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-ts-ink">{member.name}</strong>
                  <p className="m-0 truncate text-xs text-ts-muted">{member.email}</p>
                </div>
                <Badge tone={member.role === "Owner" ? "brand" : "neutral"} size="sm">
                  {member.role}
                </Badge>
                <PreviewActionButton
                  type="button"
                  className="inline-flex h-8 items-center rounded-ts-md px-2 text-[13px] font-semibold text-ts-primary transition-colors hover:bg-ts-surface-2"
                  storageKey={`employer-team-manage-${member.email}`}
                  successLabel="Updated"
                >
                  Manage
                </PreviewActionButton>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
      <div className="mt-4 grid items-start gap-4 min-[981px]:grid-cols-2">
        <SectionPanel title="Invite a colleague">
          <form className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="invite-email">
              Colleague email
            </label>
            <input
              id="invite-email"
              type="email"
              name="email"
              required
              placeholder="colleague@company.com"
              className="h-9 min-w-52 flex-1 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-[13px] text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
            />
            <label className="sr-only" htmlFor="invite-role">
              Role
            </label>
            <select id="invite-role" name="role" defaultValue="Recruiter" className="h-9 rounded-ts-md border border-ts-field bg-ts-surface px-2 text-[13px] text-ts-ink">
              <option>Recruiter</option>
              <option>Hiring manager</option>
              <option>Viewer</option>
            </select>
            <PreviewActionButton
              type="button"
              className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-9 rounded-ts-md px-3 text-[13px]")}
              storageKey="employer-team-invite"
              pendingLabel="Sending…"
              successLabel="Invite sent"
            >
              <UserPlus size={14} aria-hidden="true" /> Send invite
            </PreviewActionButton>
          </form>
        </SectionPanel>
        <SectionPanel title="Permission model">
          <div className="flex items-start gap-3 rounded-ts-md bg-ts-primary-tint/60 p-3">
            <ShieldCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-ts-primary" />
            <div>
              <strong className="block text-[13px] font-semibold text-ts-ink">Organization-scoped access</strong>
              <p className="m-0 mt-0.5 text-xs leading-relaxed text-ts-muted">
                Members only see the company, jobs, candidates, and billing capabilities assigned to their role.
              </p>
            </div>
          </div>
        </SectionPanel>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Clock3, MailCheck, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Team and permissions" };

const permissions = [
  { role: "Owner", detail: "Billing, team, every job and candidate" },
  { role: "Recruiter", detail: "Jobs, candidates, messages and assessments" },
  { role: "Hiring manager", detail: "Assigned roles, interviews and feedback" },
  { role: "Viewer", detail: "Read-only access to pipelines and reports" }
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamPage() {
  return (
    <>
      <WorkspaceHeader eyebrow="Organization access" title="Team & permissions" description="Invite colleagues and control company-level hiring permissions." />

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Members", value: employerSummary.members.length, detail: `${employerSummary.plan.seats} seats`, icon: UsersRound },
          { label: "Pending invites", value: employerSummary.pendingInvites.length, detail: "awaiting acceptance", tone: "attention", icon: Clock3 },
          { label: "Roles in use", value: 3, detail: "owner, recruiter, manager", icon: ShieldCheck },
          { label: "Seats left", value: 2, detail: `on the ${employerSummary.plan.name} plan`, icon: MailCheck, href: "/employer/billing" }
        ]}
      />

      <SectionPanel
        title="Members"
        description={`${employerSummary.plan.seats} seats used · roles stay organization-scoped.`}
        bodyClassName="p-0"
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {employerSummary.members.map((member, index) => (
            <li key={member.email} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                  {initialsOf(member.name)}
                </span>
                <div className="min-w-50 flex-1">
                  <strong className="block truncate text-[15px] font-bold text-ts-ink">{member.name}</strong>
                  <p className="m-0 mt-1 truncate text-[13px] text-ts-muted">{member.email}</p>
                </div>
                <Badge tone={member.role === "Owner" ? "brand" : "neutral"} size="md" className="shrink-0 px-3 py-1">
                  {member.role}
                </Badge>
                <PreviewActionButton
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center rounded-ts-md border border-ts-line bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                  storageKey={`employer-team-manage-${member.email}`}
                  successLabel="Updated"
                >
                  Manage access
                </PreviewActionButton>
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>

      <div className="mt-6 grid items-stretch gap-6 min-[1180px]:grid-cols-2">
        <SectionPanel title="Invite a colleague" description="They receive an email with a role already assigned." bodyClassName="flex flex-col gap-5">
          <form className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-56 flex-1 flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
              Colleague email
              <input
                id="invite-email"
                type="email"
                name="email"
                required
                placeholder="colleague@company.com"
                className="h-12 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3.5 text-sm text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
              Role
              <select
                id="invite-role"
                name="role"
                defaultValue="Recruiter"
                className="h-12 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-sm text-ts-ink outline-none focus:border-ts-primary"
              >
                <option>Recruiter</option>
                <option>Hiring manager</option>
                <option>Viewer</option>
              </select>
            </label>
            <PreviewActionButton
              type="button"
              className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-sm")}
              storageKey="employer-team-invite"
              pendingLabel="Sending…"
              successLabel="Invite sent"
            >
              <UserPlus size={16} aria-hidden="true" /> Send invite
            </PreviewActionButton>
          </form>

          <div className="mt-auto flex flex-col gap-2.5 border-t border-ts-line pt-5">
            <span className="text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">Pending invites</span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {employerSummary.pendingInvites.map((invite) => (
                <li key={invite.email} className="flex flex-wrap items-center gap-3 rounded-ts-md border border-ts-line bg-ts-surface-2/50 px-4 py-3">
                  <span className="min-w-40 flex-1 truncate text-sm font-semibold text-ts-ink">{invite.email}</span>
                  <Badge tone="neutral" size="sm">
                    {invite.role}
                  </Badge>
                  <span className="text-[13px] text-ts-muted">{invite.sent}</span>
                  <PreviewActionButton
                    type="button"
                    className="inline-flex h-9 items-center rounded-ts-md px-3 text-[13px] font-bold text-ts-primary transition-colors hover:bg-ts-surface"
                    storageKey={`employer-team-resend-${invite.email}`}
                    successLabel="Resent"
                  >
                    Resend
                  </PreviewActionButton>
                </li>
              ))}
            </ul>
          </div>
        </SectionPanel>

        <SectionPanel title="Permission model" description="What each role can reach inside the workspace." bodyClassName="p-0">
          <ul className="m-0 flex h-full list-none flex-col p-0">
            {permissions.map((row, index) => (
              <li key={row.role} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
                <div className="flex w-full items-center gap-3.5 px-6 py-4 max-[680px]:px-4">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-primary-tint text-ts-primary">
                    <ShieldCheck size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-ts-ink">{row.role}</span>
                    <span className="block text-[13px] text-ts-muted">{row.detail}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionPanel>
      </div>
    </>
  );
}

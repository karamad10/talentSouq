import type { Metadata } from "next";
import { Clock3, MailCheck, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MetricCards } from "@/components/ui/metric-cards";
import { IconTile, PageBody, PanelAction, PersonAvatar, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Team and permissions" };

const permissions = [
  { role: "Owner", detail: "Billing, team, every job and candidate" },
  { role: "Recruiter", detail: "Jobs, candidates, messages and assessments" },
  { role: "Hiring manager", detail: "Assigned roles, interviews and feedback" },
  { role: "Viewer", detail: "Read-only access to pipelines and reports" }
];

const fieldLabelClass = "block text-xs font-bold tracking-[0.06em] text-ts-muted uppercase";
const fieldClass =
  "mt-2 h-11 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3.5 text-sm text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary";

export default function TeamPage() {
  return (
    <>
      <WorkspaceHeader eyebrow="Organization access" title="Team & permissions" description="Invite colleagues and control company-level hiring permissions." />

      <PageBody>
        <MetricCards
          items={[
            { label: "Members", value: employerSummary.members.length, detail: `${employerSummary.plan.seats} seats`, icon: UsersRound },
            { label: "Pending invites", value: employerSummary.pendingInvites.length, detail: "awaiting acceptance", tone: "attention", icon: Clock3 },
            { label: "Roles in use", value: 3, detail: "owner, recruiter, manager", icon: ShieldCheck },
            { label: "Seats left", value: 2, detail: `on the ${employerSummary.plan.name} plan`, icon: MailCheck, href: "/employer/billing" }
          ]}
        />

        <SplitLayout
          rail={
            <>
              <SectionPanel title="Permission model" description="What each role can reach." bodyClassName="p-0">
                <ul className="m-0 flex list-none flex-col p-0">
                  {permissions.map((row, index) => (
                    <li key={row.role} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                      <div className="flex items-center gap-3 px-6 py-3.5">
                        <IconTile icon={ShieldCheck} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-ts-ink">{row.role}</span>
                          <span className="block text-[13px] leading-snug text-ts-muted">{row.detail}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionPanel>

              <SectionPanel
                title="Pending invites"
                bodyClassName="p-0"
                action={<span className="shrink-0 text-[13px] font-bold text-ts-accent-deep">{employerSummary.pendingInvites.length}</span>}
              >
                <ul className="m-0 flex list-none flex-col p-0">
                  {employerSummary.pendingInvites.map((invite, index) => (
                    <li key={invite.email} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                      {/* Email on its own line: at rail width it cannot share a
                          row with the role and the resend action without truncating. */}
                      <div className="flex flex-col gap-2 px-6 py-3.5">
                        <span className="text-sm font-semibold break-all text-ts-ink">{invite.email}</span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <Badge tone="neutral" size="sm" className="shrink-0">
                            {invite.role}
                          </Badge>
                          <span className="text-[13px] text-ts-muted">{invite.sent}</span>
                          <PreviewActionButton
                            type="button"
                            className="ms-auto inline-flex h-8 shrink-0 items-center rounded-ts-md px-2.5 text-[13px] font-bold text-ts-primary transition-colors hover:bg-ts-surface-2"
                            storageKey={`employer-team-resend-${invite.email}`}
                            successLabel="Resent"
                          >
                            Resend
                          </PreviewActionButton>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionPanel>
            </>
          }
        >
          <SectionPanel
            title="Members"
            description={`${employerSummary.plan.seats} seats used · roles stay organization-scoped.`}
            bodyClassName="p-0"
            action={<PanelAction href="/employer/billing">Add seats</PanelAction>}
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {employerSummary.members.map((member, index) => (
                <li key={member.email} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 max-[680px]:px-5">
                    <PersonAvatar name={member.name} size="lg" />
                    <div className="min-w-45 flex-1">
                      <strong className="block truncate text-sm font-bold text-ts-ink">{member.name}</strong>
                      <p className="m-0 mt-0.5 truncate text-[13px] text-ts-muted">{member.email}</p>
                    </div>
                    <Badge tone={member.role === "Owner" ? "brand" : "neutral"} size="sm" className="shrink-0 px-2.5 py-0.5">
                      {member.role}
                    </Badge>
                    <PreviewActionButton
                      type="button"
                      className="inline-flex h-9 shrink-0 items-center rounded-ts-md border border-ts-line-soft bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
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

          <SectionPanel title="Invite a colleague" description="They receive an email with a role already assigned." flush>
            <form className="flex flex-wrap items-end gap-3">
              <div className="min-w-56 flex-1">
                <label className={fieldLabelClass} htmlFor="invite-email">
                  Colleague email
                </label>
                <input id="invite-email" type="email" name="email" required placeholder="colleague@company.com" className={fieldClass} />
              </div>
              <div>
                <label className={fieldLabelClass} htmlFor="invite-role">
                  Role
                </label>
                <select id="invite-role" name="role" defaultValue="Recruiter" className={cn(fieldClass, "w-auto")}>
                  <option>Recruiter</option>
                  <option>Hiring manager</option>
                  <option>Viewer</option>
                </select>
              </div>
              <PreviewActionButton
                type="button"
                className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 rounded-ts-md px-5 text-sm")}
                storageKey="employer-team-invite"
                pendingLabel="Sending…"
                successLabel="Invite sent"
              >
                <UserPlus size={16} aria-hidden="true" /> Send invite
              </PreviewActionButton>
            </form>
          </SectionPanel>
        </SplitLayout>
      </PageBody>
    </>
  );
}

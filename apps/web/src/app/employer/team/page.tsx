import type { Metadata } from "next";
import { ShieldCheck, UserPlus } from "lucide-react";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Team and permissions" };
export default function TeamPage() { return <><WorkspaceHeader eyebrow="Organization access" title="Team & permissions" description="Invite colleagues and control company-level hiring permissions." action={{ href: "/employer/team", label: "Invite member" }} />
  <SectionCard title="Members" description="Owner, recruiter, hiring manager, and viewer roles remain organization-scoped."><div className="member-list">{employerSummary.members.map((member) => <article key={member.email}><span className="candidate-avatar">{member.name.slice(0, 2)}</span><div><strong>{member.name}</strong><p>{member.email}</p></div><span className="status-pill">{member.role}</span><button className="text-button">Manage</button></article>)}</div></SectionCard>
  <div className="workspace-content-grid"><SectionCard title="Invite a colleague"><form className="inline-form"><input type="email" placeholder="colleague@company.com" /><select defaultValue="Recruiter"><option>Recruiter</option><option>Hiring manager</option><option>Viewer</option></select><button className="button button-primary button-small"><UserPlus size={15} /> Send invite</button></form></SectionCard><SectionCard title="Permission model"><div className="dashboard-callout"><ShieldCheck size={20} /><div><strong>Organization-scoped access</strong><p>Members only see the company, jobs, candidates, and billing capabilities assigned to their role.</p></div></div></SectionCard></div></>; }

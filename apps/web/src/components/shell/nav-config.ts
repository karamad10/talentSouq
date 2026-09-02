import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Search,
  Sparkles,
  UserRound,
  UsersRound
} from "lucide-react";
import type { Route } from "next";
import { employerSummary, seekerSummary } from "@/data/workspace";

export type WorkspaceRole = "seeker" | "employer";

export type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  count?: number;
};

export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: Record<WorkspaceRole, NavGroup[]> = {
  seeker: [
    {
      label: "Workspace",
      items: [
        { href: "/seeker", label: "Home", icon: LayoutDashboard, exact: true },
        { href: "/seeker/jobs", label: "Discover jobs", icon: Search },
        { href: "/seeker/applications", label: "Applications", icon: BriefcaseBusiness, count: seekerSummary.applications.length },
        { href: "/seeker/offers", label: "Offers & interviews", icon: CalendarDays, count: seekerSummary.pendingInvites }
      ]
    },
    {
      label: "Career",
      items: [
        { href: "/seeker/saved", label: "Saved & alerts", icon: Bookmark, count: seekerSummary.savedJobs },
        { href: "/seeker/messages", label: "Messages", icon: MessageSquare, count: seekerSummary.unreadMessages },
        { href: "/seeker/notifications", label: "Notifications", icon: Bell },
        { href: "/seeker/companion", label: "AI companion", icon: Sparkles },
        { href: "/seeker/profile", label: "My profile", icon: UserRound }
      ]
    }
  ],
  employer: [
    {
      label: "Hiring",
      items: [
        { href: "/employer", label: "Home", icon: LayoutDashboard, exact: true },
        { href: "/employer/jobs", label: "Jobs", icon: BriefcaseBusiness, count: employerSummary.openRoles },
        { href: "/employer/candidates", label: "Find candidates", icon: Search },
        { href: "/employer/pipeline", label: "ATS pipeline", icon: FolderKanban, count: employerSummary.newApplicants },
        { href: "/employer/interviews", label: "Interviews", icon: CalendarDays, count: employerSummary.interviews },
        { href: "/employer/assessments", label: "Assessments", icon: ClipboardCheck }
      ]
    },
    {
      label: "Organization",
      items: [
        { href: "/employer/messages", label: "Messages", icon: MessageSquare, count: 5 },
        { href: "/employer/notifications", label: "Notifications", icon: Bell },
        { href: "/employer/company", label: "Company profile", icon: Building2 },
        { href: "/employer/team", label: "Team & permissions", icon: UsersRound },
        { href: "/employer/billing", label: "Plan & credits", icon: CreditCard }
      ]
    }
  ]
};

export type WorkspaceIdentity = {
  eyebrow: string;
  name: string;
  meta: string;
  initials: string;
  href: Route;
};

export const workspaceIdentity: Record<WorkspaceRole, WorkspaceIdentity> = {
  seeker: { eyebrow: "Personal workspace", name: seekerSummary.name, meta: seekerSummary.headline, initials: "SA", href: "/seeker/profile" },
  employer: { eyebrow: "Company workspace", name: employerSummary.organization, meta: "Employer account", initials: "NC", href: "/employer/company" }
};

export const workspaceSearch: Record<WorkspaceRole, { action: Route; placeholder: string; label: string }> = {
  seeker: { action: "/seeker/jobs", placeholder: "Search jobs, companies, messages…", label: "Search your workspace" },
  employer: { action: "/employer/candidates", placeholder: "Search candidates, jobs, messages…", label: "Search your workspace" }
};

export const workspaceUnread: Record<WorkspaceRole, { messages: number; messagesHref: Route; notificationsHref: Route }> = {
  seeker: { messages: seekerSummary.unreadMessages, messagesHref: "/seeker/messages", notificationsHref: "/seeker/notifications" },
  employer: { messages: 5, messagesHref: "/employer/messages", notificationsHref: "/employer/notifications" }
};

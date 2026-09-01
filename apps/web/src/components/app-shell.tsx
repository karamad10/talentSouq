"use client";

import { Bell, Bookmark, BriefcaseBusiness, Building2, CalendarDays, ClipboardCheck, CreditCard, FolderKanban, LayoutDashboard, MessageSquare, Search, Sparkles, UserRound, UsersRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { DevWorkspaceSwitcher } from "@/components/dev-workspace-switcher";

type NavItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type AppShellProps = {
  active: "seeker" | "employer";
  children: ReactNode;
};

type NavGroup = { label: string; items: NavItem[] };

const nav: Record<AppShellProps["active"], NavGroup[]> = {
  seeker: [
    { label: "Workspace", items: [
      { href: "/seeker", label: "Home", icon: LayoutDashboard, exact: true },
      { href: "/seeker/jobs", label: "Discover jobs", icon: Search },
      { href: "/seeker/applications", label: "Applications", icon: BriefcaseBusiness },
      { href: "/seeker/offers", label: "Offers & interviews", icon: CalendarDays }
    ] },
    { label: "Career", items: [
      { href: "/seeker/saved", label: "Saved & alerts", icon: Bookmark },
      { href: "/seeker/messages", label: "Messages", icon: MessageSquare },
      { href: "/seeker/companion", label: "AI companion", icon: Sparkles },
      { href: "/seeker/profile", label: "My profile", icon: UserRound }
    ] }
  ],
  employer: [
    { label: "Hiring", items: [
      { href: "/employer", label: "Home", icon: LayoutDashboard, exact: true },
      { href: "/employer/jobs", label: "Jobs", icon: BriefcaseBusiness },
      { href: "/employer/candidates", label: "Find candidates", icon: Search },
      { href: "/employer/pipeline", label: "ATS pipeline", icon: FolderKanban },
      { href: "/employer/interviews", label: "Interviews", icon: CalendarDays },
      { href: "/employer/assessments", label: "Assessments", icon: ClipboardCheck }
    ] },
    { label: "Organization", items: [
      { href: "/employer/messages", label: "Messages", icon: MessageSquare },
      { href: "/employer/company", label: "Company profile", icon: Building2 },
      { href: "/employer/team", label: "Team & permissions", icon: UsersRound },
      { href: "/employer/billing", label: "Plan & credits", icon: CreditCard }
    ] }
  ]
};

export function AppShell({ active, children }: AppShellProps) {
  const pathname = usePathname();
  const identity = active === "seeker"
    ? { eyebrow: "Personal profile", name: "Sarah Ahmed", meta: "Senior Product Designer", initial: "SA", href: "/seeker/profile" as Route }
    : { eyebrow: "Company workspace", name: "Nexa Commerce", meta: "Employer account", initial: "NC", href: "/employer/company" as Route };

  return <main className="workspace"><aside className="workspace-sidebar"><Logo /><Link className="workspace-identity" href={identity.href}><span>{identity.initial}</span><div><small>{identity.eyebrow}</small><strong>{identity.name}</strong><em>{identity.meta}</em></div></Link><DevWorkspaceSwitcher /><nav aria-label={`${active} workspace`} className="workspace-nav">{nav[active].map((group) => <div className="workspace-nav-group" key={group.label}><span>{group.label}</span>{group.items.map((item) => {
    const Icon = item.icon;
    const isCurrent = item.exact ? pathname === item.href : pathname.startsWith(item.href);
    return <Link key={item.href} href={item.href} aria-current={isCurrent ? "page" : undefined}><Icon size={17} />{item.label}</Link>;
  })}</div>)}</nav><div className="workspace-sidebar-actions"><Link href={active === "seeker" ? "/seeker/messages" : "/employer/messages"}><Bell size={16} /> Notifications</Link><form action={signOut}><button type="submit">Sign out</button></form></div></aside><section className="workspace-main">{children}</section></main>;
}

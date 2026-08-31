import { BriefcaseBusiness, Building2, LayoutDashboard, MessageSquare, Search, Settings, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/logo";

type NavItem = {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
};

type AppShellProps = {
  active: "seeker" | "employer";
  children: ReactNode;
};

const nav: Record<AppShellProps["active"], NavItem[]> = {
  seeker: [
    { href: "/seeker", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Find jobs", icon: Search },
    { href: "/seeker#applications", label: "Applications", icon: BriefcaseBusiness },
    { href: "/seeker#profile", label: "Profile", icon: UserRound },
    { href: "/seeker#messages", label: "Messages", icon: MessageSquare }
  ],
  employer: [
    { href: "/employer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employer#vacancies", label: "Vacancies", icon: BriefcaseBusiness },
    { href: "/employer#pipeline", label: "Applicants", icon: UserRound },
    { href: "/employer#company", label: "Company", icon: Building2 },
    { href: "/employer#settings", label: "Settings", icon: Settings }
  ]
};

export function AppShell({ active, children }: AppShellProps) {
  return <main className="workspace"><aside className="workspace-sidebar"><Logo /><nav aria-label={`${active} workspace`} className="workspace-nav">{nav[active].map((item) => {
    const Icon = item.icon;
    return <Link key={item.href} href={item.href} aria-current={item.href === `/${active}` ? "page" : undefined}><Icon size={18} />{item.label}</Link>;
  })}</nav><form action={signOut} className="signout-form"><button className="filter-button" type="submit">Sign out</button></form><div className="workspace-sidebar-note"><span>Backend ready</span><p>Protected routes use Supabase when the environment is configured.</p></div></aside><section className="workspace-main">{children}</section></main>;
}

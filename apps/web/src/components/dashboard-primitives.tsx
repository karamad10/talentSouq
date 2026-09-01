import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type DashboardLink = {
  href: Route;
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  tone?: "default" | "attention" | "success";
};

export function DashboardLead({ eyebrow, title, description, action, children }: { eyebrow: string; title: string; description: string; action: { href: Route; label: string }; children: ReactNode }) {
  return <section className="dashboard-lead"><div className="dashboard-lead-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><Link className="button button-primary button-small" href={action.href}>{action.label}<ArrowUpRight size={16} /></Link></div><div className="dashboard-lead-priority">{children}</div></section>;
}

export function DashboardMetricLinks({ items }: { items: Array<DashboardLink & { value: string | number }> }) {
  return <section className="dashboard-metric-links" aria-label="Workspace metrics">{items.map(({ href, icon: Icon, title, description, meta, value, tone = "default" }) => <Link className="dashboard-metric-link" data-tone={tone} href={href} key={title}><Icon size={17} /><strong>{value}</strong><span>{title}</span><small>{description}</small>{meta ? <em>{meta}</em> : null}<ArrowUpRight size={15} /></Link>)}</section>;
}

export function DashboardLinkGrid({ title, description, items }: { title: string; description: string; items: DashboardLink[] }) {
  return <section className="dashboard-directory" aria-labelledby="workspace-directory-title"><header><div><p className="eyebrow">Everything in one place</p><h2 id="workspace-directory-title">{title}</h2><p>{description}</p></div></header><div className="dashboard-directory-grid">{items.map(({ href, icon: Icon, title: itemTitle, description: itemDescription, meta, tone = "default" }) => <Link href={href} data-tone={tone} key={itemTitle}><span className="dashboard-directory-icon"><Icon size={18} /></span><div><strong>{itemTitle}</strong><p>{itemDescription}</p>{meta ? <small>{meta}</small> : null}</div><ArrowUpRight size={16} /></Link>)}</div></section>;
}

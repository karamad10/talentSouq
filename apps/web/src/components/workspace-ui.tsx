import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export function WorkspaceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: { href: Route; label: string } }) {
  return <header className="workspace-header compact"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action ? <Link className="button button-primary button-small" href={action.href}>{action.label}</Link> : null}</header>;
}

export function StatCard({ icon: Icon, value, label, detail }: { icon: LucideIcon; value: string | number; label: string; detail?: string }) {
  return <article><Icon size={18} /><strong>{value}</strong><span>{label}</span>{detail ? <small>{detail}</small> : null}</article>;
}

export function SectionCard({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`workspace-section ${className}`}><div className="panel-title"><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{action}</div>{children}</section>;
}

export function InfoList({ title, values }: { title: string; values: string[] }) {
  return <article className="info-list"><h3>{title}</h3><ul>{values.map((value) => <li key={value}>{value}</li>)}</ul></article>;
}

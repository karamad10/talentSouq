import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export type StatusTone = "neutral" | "review" | "success" | "attention" | "danger";

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: StatusTone }) {
  return <span className="status-badge" data-tone={tone}>{children}</span>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  return <div className="progress-bar" aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={normalizedValue} role="progressbar"><span style={{ width: `${normalizedValue}%` }} /></div>;
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: { href: Route; label: string } }) {
  return <div className="empty-state"><Icon aria-hidden="true" size={24} /><strong>{title}</strong><p>{description}</p>{action ? <Link className="button button-secondary button-small" href={action.href}>{action.label}</Link> : null}</div>;
}

export function InlineNotice({ title, children, tone = "neutral" }: { title: string; children: ReactNode; tone?: "neutral" | "success" | "attention" | "danger" }) {
  return <aside className="inline-notice" data-tone={tone}><strong>{title}</strong><p>{children}</p></aside>;
}

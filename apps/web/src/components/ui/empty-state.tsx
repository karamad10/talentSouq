import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: Route; label: string };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="grid min-h-85 place-items-center content-center gap-3 rounded-[var(--radius-md)] border border-dashed border-line px-6 text-center text-ink-soft">
      <Icon aria-hidden="true" size={26} className="text-ink-soft" />
      <strong className="text-lg text-ink-deep">{title}</strong>
      <p className="max-w-sm">{description}</p>
      {action ? (
        <Link href={action.href} className={buttonVariants({ tone: "secondary", size: "sm" })}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

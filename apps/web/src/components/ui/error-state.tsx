import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ErrorState({ title, description, retry, className }: { title: string; description?: string; retry?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-2 rounded-ts-lg border border-ts-line bg-ts-surface px-6 py-8 text-center", className)}>
      <span className="grid size-9 place-items-center rounded-full bg-ts-danger-tint text-ts-danger">
        <CircleAlert size={18} aria-hidden="true" />
      </span>
      <strong className="text-sm font-semibold text-ts-ink">{title}</strong>
      {description ? <p className="m-0 max-w-96 text-[13px] leading-relaxed text-ts-muted">{description}</p> : null}
      {retry}
    </div>
  );
}

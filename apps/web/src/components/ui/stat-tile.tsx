import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type StatTileProps = {
  label: string;
  value: ReactNode;
  trend?: { direction: "up" | "down"; label: string };
  className?: string;
};

export function StatTile({ label, value, trend, className }: StatTileProps) {
  return (
    <Card padding="md" elevated className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">{label}</span>
      <strong className="text-3xl leading-none text-ink-deep">{value}</strong>
      {trend ? (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-bold",
            trend.direction === "up" ? "text-success" : "text-danger"
          )}
        >
          {trend.direction === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend.label}
        </span>
      ) : null}
    </Card>
  );
}

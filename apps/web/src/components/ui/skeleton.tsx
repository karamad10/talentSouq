import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block animate-pulse rounded-ts-sm bg-ts-surface-2", className)} />;
}

export function SkeletonRows({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="block h-9 animate-pulse rounded-ts-sm bg-ts-surface-2" />
      ))}
    </div>
  );
}

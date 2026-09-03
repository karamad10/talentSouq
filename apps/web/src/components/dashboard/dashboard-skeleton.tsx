import { Skeleton } from "@/components/ui/skeleton";

/** Shared loading shape for both workspace home routes: header, KPIs, spotlight, then the panel grids. */
export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Skeleton className="h-28 w-full rounded-ts-lg" />
      <Skeleton className="h-40 w-full rounded-ts-lg" />
      <div className="grid items-start gap-6 min-[1560px]:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        <Skeleton className="h-112 w-full rounded-ts-lg min-[1560px]:row-span-2" />
        <Skeleton className="h-52 w-full rounded-ts-lg" />
        <Skeleton className="h-56 w-full rounded-ts-lg" />
      </div>
      <div className="grid items-start gap-6 min-[1280px]:grid-cols-3">
        <Skeleton className="h-72 w-full rounded-ts-lg" />
        <Skeleton className="h-72 w-full rounded-ts-lg" />
        <Skeleton className="h-72 w-full rounded-ts-lg" />
      </div>
    </div>
  );
}

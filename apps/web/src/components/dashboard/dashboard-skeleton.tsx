import { Skeleton } from "@/components/ui/skeleton";

/** Shared loading shape for both workspace home routes. */
export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-20 w-full rounded-ts-lg" />
      <div className="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-ts-lg" />
          <Skeleton className="h-48 w-full rounded-ts-lg" />
          <Skeleton className="h-56 w-full rounded-ts-lg" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full rounded-ts-lg" />
          <Skeleton className="h-44 w-full rounded-ts-lg" />
          <Skeleton className="h-52 w-full rounded-ts-lg" />
        </div>
      </div>
    </div>
  );
}

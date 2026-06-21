import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

function DashboardListRowSkeleton() {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4" aria-hidden>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </Card>
  );
}

export function DashboardListSkeleton({ count = 5, className }) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <DashboardListRowSkeleton key={index} />
      ))}
    </div>
  );
}

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

export function BookingCardSkeleton({ className }) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
        className
      )}
      aria-hidden
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </Card>
  );
}

export function BookingCardSkeletonList({ count = 4, className }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }, (_, index) => (
        <BookingCardSkeleton key={index} />
      ))}
    </div>
  );
}

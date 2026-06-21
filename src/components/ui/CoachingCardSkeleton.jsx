import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

export function CoachingCardSkeleton({ className }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm",
        className
      )}
      aria-hidden
    >
      <div className="relative h-28">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute bottom-0 left-5 h-14 w-14 translate-y-1/2 rounded-full ring-4 ring-white" />
      </div>

      <div className="flex flex-1 flex-col p-5 pt-10">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-10 shrink-0" />
        </div>
        <Skeleton className="mt-2 h-4 w-1/2" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        <div className="mt-4 flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </article>
  );
}

export function CoachingCardSkeletonGrid({ count = 6, className }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {Array.from({ length: count }, (_, index) => (
        <CoachingCardSkeleton key={index} />
      ))}
    </div>
  );
}

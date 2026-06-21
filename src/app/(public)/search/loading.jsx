import { CoachingCardSkeletonGrid } from "@/components/ui/CoachingCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-32" />
      <Skeleton className="mt-4 h-11 w-full lg:hidden" />

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <Skeleton className="hidden h-64 w-full lg:block" />
        <div className="lg:col-span-3">
          <CoachingCardSkeletonGrid count={6} />
        </div>
      </div>
    </div>
  );
}

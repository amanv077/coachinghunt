import { Skeleton } from "@/components/ui/Skeleton";

export default function CoachingProfileLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Skeleton className="h-40 w-full rounded-2xl sm:h-52" />

      <div className="relative -mt-12 px-2 sm:-mt-14 sm:px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-2xl ring-4 ring-white sm:h-24 sm:w-24" />
            <div className="space-y-2 pb-1">
              <Skeleton className="h-7 w-48 sm:w-64" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-xl sm:w-40" />
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-20 shrink-0 rounded-full" />
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

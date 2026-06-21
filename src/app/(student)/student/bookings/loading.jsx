import { BookingCardSkeletonList } from "@/components/ui/BookingCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentBookingsLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <Skeleton className="mt-6 h-11 w-full max-w-md rounded-xl" />
      <div className="mt-6">
        <BookingCardSkeletonList count={4} />
      </div>
    </div>
  );
}

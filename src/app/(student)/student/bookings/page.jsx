import { getStudentBookings } from "@/modules/bookings/bookings.service";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CancelBookingButton } from "@/components/shared/CancelBookingButton";

export default async function StudentBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const bookings = await getStudentBookings(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="text-muted">All your demo session bookings</p>
      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <EmptyState title="No bookings yet" description="Book a demo session to get started." />
        ) : (
          bookings.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{b.coaching.name}</p>
                <p className="text-sm text-muted">{b.course.title} · {b.demoSlot.topic}</p>
                <p className="text-sm text-muted">{new Date(b.demoSlot.demoDate).toLocaleDateString()} · {b.demoSlot.startTime}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={b.status === "CONFIRMED" ? "success" : "default"}>{b.status}</Badge>
                <Badge variant="primary">{b.bookingCode}</Badge>
                {b.status === "CONFIRMED" && <CancelBookingButton bookingId={b.id} />}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

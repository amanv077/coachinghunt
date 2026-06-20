import Link from "next/link";
import { getStudentBookings } from "@/modules/bookings/bookings.service";
import { getStudentDemoRequests } from "@/modules/demo-requests/demo-requests.service";
import { getSession } from "@/lib/auth/session";
import { getLoginHref } from "@/lib/auth/login";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { CancelBookingButton } from "@/components/shared/CancelBookingButton";
import { RescheduleBookingButton } from "@/components/shared/RescheduleBookingButton";
import { StudentBookingsTabs } from "@/components/student/StudentBookingsTabs";
import { StudentDemoRequestCard } from "@/components/student/StudentDemoRequestCard";
import {
  buildSearchHref,
  formatDemoDate,
  getRelativeDateLabel,
  startOfToday,
} from "@/lib/utils/helpers";

function BookingCard({ booking, showCancel = false }) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{booking.coaching.name}</p>
        <p className="text-sm text-muted">
          {booking.course?.title || "Demo"} · {booking.demoSlot.topic}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">
            {formatDemoDate(booking.demoSlot.demoDate)} · {booking.demoSlot.startTime}
          </p>
          <Badge variant="default">{getRelativeDateLabel(booking.demoSlot.demoDate)}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={booking.status === "CONFIRMED" ? "success" : "default"}>
          {booking.status}
        </Badge>
        <Badge variant="primary">{booking.bookingCode}</Badge>
        {showCancel && booking.status === "CONFIRMED" && (
          <>
            <RescheduleBookingButton bookingId={booking.id} />
            <CancelBookingButton bookingId={booking.id} />
          </>
        )}
      </div>
    </Card>
  );
}

export default async function StudentBookingsPage() {
  const session = await getSession();
  if (!session) redirect(getLoginHref("/student/bookings"));

  const bookings = await getStudentBookings(session.user.id);
  const demoRequests = await getStudentDemoRequests(session.user.id);
  const pendingRequestCount = demoRequests.filter((r) => r.status === "PENDING").length;
  const today = startOfToday();

  const upcoming = bookings
    .filter(
      (booking) =>
        booking.status === "CONFIRMED" && new Date(booking.demoSlot.demoDate) >= today
    )
    .sort(
      (a, b) => new Date(a.demoSlot.demoDate) - new Date(b.demoSlot.demoDate)
    );

  const past = bookings
    .filter(
      (booking) =>
        booking.status !== "CONFIRMED" ||
        new Date(booking.demoSlot.demoDate) < today
    )
    .sort(
      (a, b) => new Date(b.demoSlot.demoDate) - new Date(a.demoSlot.demoDate)
    );

  const searchHref = buildSearchHref();

  const bookingsContent = (
    <div className="space-y-8">
      <section>
        <SectionHeader title="Upcoming" />
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">No upcoming demos</h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              Book a free demo session or request one on your preferred date.
            </p>
            <Link href={searchHref} className="mt-4 w-full sm:w-auto">
              <Button className="w-full min-h-11 sm:w-auto">Find Coachings</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showCancel />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Past" />
        {past.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">No past bookings</h3>
            <p className="mt-2 text-sm text-muted">
              Completed and cancelled demos will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const requestsContent = (
    <section>
      {demoRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">No demo requests yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted">
            When a coaching has no open slots, request a demo on a date that works for you.
          </p>
          <Link href={searchHref} className="mt-4 w-full sm:w-auto">
            <Button className="w-full min-h-11 sm:w-auto">Find Coachings</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {demoRequests.map((request) => (
            <StudentDemoRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-1 text-muted">Your demo bookings and requests</p>
      </div>

      <StudentBookingsTabs
        bookingsContent={bookingsContent}
        requestsContent={requestsContent}
        pendingCount={pendingRequestCount}
      />
    </div>
  );
}

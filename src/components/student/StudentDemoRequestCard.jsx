import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoRequestStatusBadge } from "@/components/shared/DemoRequestStatusBadge";
import { CancelDemoRequestButton } from "@/components/shared/CancelDemoRequestButton";
import { formatDemoDate } from "@/lib/utils/helpers";

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function StudentDemoRequestCard({ request }) {
  const bookingCode = request.resultingSlot?.bookings?.[0]?.bookingCode;

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{request.coaching.name}</p>
          <DemoRequestStatusBadge status={request.status} />
        </div>
        {request.course?.title && (
          <p className="mt-1 text-sm text-muted">{request.course.title}</p>
        )}
        {request.preferredDate && (
          <p className="mt-2 text-sm text-muted">
            Requested: {formatDemoDate(request.preferredDate)}
            {request.preferredTime
              ? ` · ${TIME_LABELS[request.preferredTime] || request.preferredTime}`
              : ""}
          </p>
        )}
        {request.proposedDate && ["APPROVED", "RESCHEDULED"].includes(request.status) && (
          <p className="mt-1 text-sm font-medium text-success">
            Confirmed: {formatDemoDate(request.proposedDate)} · {request.proposedTime}
          </p>
        )}
        {request.responseNote && request.status === "DECLINED" && (
          <p className="mt-2 text-sm text-danger">{request.responseNote}</p>
        )}
        {request.responseNote && request.status === "RESCHEDULED" && (
          <p className="mt-2 text-sm text-muted">{request.responseNote}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {bookingCode && (
          <Link href="/student/bookings">
            <Badge variant="primary">{bookingCode}</Badge>
          </Link>
        )}
        {request.status === "PENDING" && (
          <CancelDemoRequestButton requestId={request.id} />
        )}
      </div>
    </Card>
  );
}

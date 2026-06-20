import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { cancelBooking } from "@/modules/bookings/bookings.service";
import { createDemoRequest } from "@/modules/demo-requests/demo-requests.service";
import { prisma } from "@/lib/db/prisma";

export async function POST(request, { params }) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const student = await prisma.studentProfile.findUnique({ where: { userId: auth.session.user.id } });
    const booking = await prisma.booking.findFirst({
      where: { id, studentId: student?.id, status: "CONFIRMED" },
      include: { demoSlot: true, coaching: true, course: true },
    });

    if (!booking) return errorResponse("Booking not found", [], 404);

    await cancelBooking(booking.id, auth.session.user.id);

    const demoRequest = await createDemoRequest(auth.session.user.id, {
      coachingId: booking.coachingId,
      courseId: booking.courseId,
      preferredDate: body.preferredDate || booking.demoSlot.demoDate,
      preferredTime: body.preferredTime || booking.demoSlot.startTime,
      message: body.message || "Reschedule requested by student",
    });

    await prisma.demoRequest.update({
      where: { id: demoRequest.id },
      data: { rescheduleOf: booking.id },
    });

    return successResponse(demoRequest, "Reschedule request submitted");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

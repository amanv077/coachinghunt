import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { rescheduleBooking } from "@/modules/bookings/bookings.service";

export async function POST(request, { params }) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const demoRequest = await rescheduleBooking(id, auth.session.user.id, {
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      message: body.message,
    });

    return successResponse(demoRequest, "Reschedule request submitted");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

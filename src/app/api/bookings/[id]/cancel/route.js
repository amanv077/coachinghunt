import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { cancelBooking } from "@/modules/bookings/bookings.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["STUDENT", "ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const booking = await cancelBooking(id, auth.session.user.id);
    return successResponse(booking, "Booking cancelled");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { markBookingNoShow } from "@/modules/bookings/bookings.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const booking = await markBookingNoShow(id, auth.session.user.id);
    return successResponse(booking, "Marked as no-show");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

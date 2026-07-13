import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateBookingLeadStatus } from "@/modules/leads/leads.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateBookingLeadStatus(auth.session.user.id, id, body);
    return successResponse(updated, "Booking lead updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

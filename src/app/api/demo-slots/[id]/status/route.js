import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateDemoSlotStatus } from "@/modules/demo-slots/demo-slots.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const { status } = await request.json();
    const slot = await updateDemoSlotStatus(id, coaching.id, status);
    return successResponse(slot, "Status updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

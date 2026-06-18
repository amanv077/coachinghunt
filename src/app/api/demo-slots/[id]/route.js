import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getDemoSlotById, updateDemoSlot } from "@/modules/demo-slots/demo-slots.service";
import { requireAuth } from "@/lib/auth/session";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const slot = await getDemoSlotById(id);
    if (!slot) return errorResponse("Demo slot not found", [], 404);
    return successResponse(slot);
  } catch (error) {
    return errorResponse("Failed to fetch demo slot", [], 500);
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const body = await request.json();
    const slot = await updateDemoSlot(id, coaching.id, body);
    return successResponse(slot, "Demo slot updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

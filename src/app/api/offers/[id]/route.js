import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateOffer } from "@/modules/offers/offers.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const body = await request.json();
    const offer = await updateOffer(id, coaching.id, body);
    return successResponse(offer, "Offer updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

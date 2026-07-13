import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listActiveOffers, listCoachOffers, createOffer } from "@/modules/offers/offers.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const coachingId = searchParams.get("coachingId") || undefined;
    const includeAll = searchParams.get("includeAll") === "true";

    const offers = includeAll && coachingId
      ? await listCoachOffers(coachingId)
      : await listActiveOffers(coachingId);
    return successResponse(offers);
  } catch (error) {
    return errorResponse("Failed to fetch offers", [], 500);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const body = await request.json();
    const offer = await createOffer(coaching.id, body);
    return successResponse(offer, "Offer created", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

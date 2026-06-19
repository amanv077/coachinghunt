import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getSavedCoachingIds, listSavedCoachings } from "@/modules/saved-coachings/saved-coachings.service";

export async function GET(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const idsOnly = searchParams.get("idsOnly") === "1";

  if (idsOnly) {
    const ids = await getSavedCoachingIds(auth.session.user.id);
    return successResponse(ids);
  }

  const coachings = await listSavedCoachings(auth.session.user.id);
  return successResponse(coachings);
}

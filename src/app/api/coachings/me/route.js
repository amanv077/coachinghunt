import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const profile = await getCoachingByUserId(auth.session.user.id);
  if (!profile) return errorResponse("Profile not found", [], 404);
  return successResponse(profile);
}

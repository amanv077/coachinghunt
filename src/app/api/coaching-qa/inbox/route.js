import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listQA } from "@/modules/coaching-qa/coaching-qa.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const coaching = await getCoachingByUserId(auth.session.user.id);
    if (!coaching) return errorResponse("Coaching not found", [], 404);
    const items = await listQA(coaching.id, { includePending: true });
    return successResponse(items);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

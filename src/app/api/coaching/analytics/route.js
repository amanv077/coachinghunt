import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getCoachingAnalytics } from "@/modules/analytics/analytics.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const data = await getCoachingAnalytics(auth.session.user.id);
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

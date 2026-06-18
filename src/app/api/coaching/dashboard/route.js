import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getCoachingDashboard } from "@/modules/admin/admin.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const data = await getCoachingDashboard(auth.session.user.id);
  return successResponse(data);
}

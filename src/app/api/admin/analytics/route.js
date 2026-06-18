import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getAdminAnalytics } from "@/modules/admin/admin.service";

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const data = await getAdminAnalytics();
  return successResponse(data);
}

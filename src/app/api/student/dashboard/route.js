import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getStudentDashboard } from "@/modules/admin/admin.service";

export async function GET() {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const data = await getStudentDashboard(auth.session.user.id);
  return successResponse(data);
}

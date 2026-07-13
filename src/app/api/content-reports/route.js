import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createContentReport } from "@/modules/content-reports/content-reports.service";

export async function POST(request) {
  const auth = await requireAuth(["STUDENT", "COACHING", "ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const report = await createContentReport(auth.session.user.id, body);
    return successResponse(report, "Report submitted", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listContentReports } from "@/modules/content-reports/content-reports.service";

export async function GET(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "PENDING";
  const reports = await listContentReports({ status });
  return successResponse(reports);
}

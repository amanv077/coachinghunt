import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateContentReportStatus } from "@/modules/content-reports/content-reports.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const report = await updateContentReportStatus(id, body);

    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: "ADMIN",
      action: "CONTENT_REPORT_UPDATED",
      entityType: "ContentReport",
      entityId: id,
      metaJson: { status: body.status },
    });

    return successResponse(report, "Report updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

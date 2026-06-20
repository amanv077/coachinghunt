import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { moderateQA } from "@/modules/coaching-qa/coaching-qa.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const item = await moderateQA(id, body);
    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: auth.session.user.role,
      action: "QA_MODERATED",
      entityType: "CoachingQA",
      entityId: id,
      metaJson: body,
    });
    return successResponse(item, "Q&A updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

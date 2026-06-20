import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { answerQuestion } from "@/modules/coaching-qa/coaching-qa.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { answer } = await request.json();
    const item = await answerQuestion(auth.session.user.id, id, answer);
    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: auth.session.user.role,
      action: "QA_ANSWERED",
      entityType: "CoachingQA",
      entityId: id,
    });
    return successResponse(item, "Answer posted");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

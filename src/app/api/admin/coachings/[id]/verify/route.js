import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateCoachingVerification } from "@/modules/admin/admin.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { verificationStatus } = await request.json();
    const coaching = await updateCoachingVerification(id, verificationStatus);
    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: "ADMIN",
      action: `COACHING_${verificationStatus}`,
      entityType: "CoachingProfile",
      entityId: id,
    });
    return successResponse(coaching, "Verification updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

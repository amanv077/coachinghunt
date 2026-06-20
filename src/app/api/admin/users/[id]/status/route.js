import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateUserStatus } from "@/modules/admin/admin.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { isActive } = await request.json();
    const user = await updateUserStatus(id, isActive);
    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: "ADMIN",
      action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      entityType: "User",
      entityId: id,
    });
    return successResponse(user, "User status updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

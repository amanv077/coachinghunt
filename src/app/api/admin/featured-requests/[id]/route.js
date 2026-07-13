import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { respondToFeaturedRequest } from "@/modules/featured-requests/featured-requests.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await respondToFeaturedRequest(id, body);

    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: "ADMIN",
      action: "FEATURED_REQUEST_UPDATED",
      entityType: "FeaturedRequest",
      entityId: id,
      metaJson: { status: body.status },
    });

    return successResponse(updated, "Featured request updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

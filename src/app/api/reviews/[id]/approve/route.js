import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { approveReview } from "@/modules/reviews/reviews.service";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { status } = await request.json();
    const review = await approveReview(id, status);
    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: "ADMIN",
      action: `REVIEW_${status}`,
      entityType: "Review",
      entityId: id,
    });
    return successResponse(review, "Review updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

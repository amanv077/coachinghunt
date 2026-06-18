import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateCoachingVerification } from "@/modules/admin/admin.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { verificationStatus } = await request.json();
    const coaching = await updateCoachingVerification(id, verificationStatus);
    return successResponse(coaching, "Verification updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

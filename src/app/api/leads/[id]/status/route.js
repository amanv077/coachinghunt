import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateLeadStatus } from "@/modules/leads/leads.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateLeadStatus(auth.session.user.id, id, body);
    return successResponse(updated, "Lead updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateFeeRecordStatus } from "@/modules/leads/leads.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { status } = await request.json();
    const record = await updateFeeRecordStatus(id, status);
    return successResponse(record, "Fee record updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

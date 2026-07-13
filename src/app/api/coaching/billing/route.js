import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listCoachFeeRecords } from "@/modules/leads/leads.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const records = await listCoachFeeRecords(auth.session.user.id);
    const pendingTotal = records
      .filter((r) => r.status === "PENDING")
      .reduce((sum, r) => sum + r.amount, 0);
    const paidTotal = records
      .filter((r) => r.status === "PAID")
      .reduce((sum, r) => sum + r.amount, 0);

    return successResponse({ records, pendingTotal, paidTotal });
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

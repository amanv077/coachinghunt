import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listFeeRecords } from "@/modules/leads/leads.service";

export async function GET(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const records = await listFeeRecords({ status: searchParams.get("status") || undefined });
  return successResponse(records);
}

import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listCoachingsAdmin } from "@/modules/admin/admin.service";

export async function GET(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const data = await listCoachingsAdmin(
    Number(searchParams.get("page") || 1),
    Number(searchParams.get("limit") || 20),
    searchParams.get("search") || ""
  );
  return successResponse(data);
}

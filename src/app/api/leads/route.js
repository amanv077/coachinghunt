import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listLeads } from "@/modules/leads/leads.service";

export async function GET(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { searchParams } = new URL(request.url);
    const leadStatus = searchParams.get("leadStatus") || undefined;
    const data = await listLeads(auth.session.user.id, { leadStatus });
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

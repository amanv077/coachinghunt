import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listFeaturedRequests } from "@/modules/featured-requests/featured-requests.service";

export async function GET(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "PENDING";
  const requests = await listFeaturedRequests({ status });
  return successResponse(requests);
}

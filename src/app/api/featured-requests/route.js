import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import {
  createFeaturedRequest,
  getCoachingFeaturedRequest,
} from "@/modules/featured-requests/featured-requests.service";

export async function GET(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const request_ = await getCoachingFeaturedRequest(auth.session.user.id);
  return successResponse(request_);
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json().catch(() => ({}));
    const featuredRequest = await createFeaturedRequest(auth.session.user.id, body.note);
    return successResponse(featuredRequest, "Featured request submitted", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

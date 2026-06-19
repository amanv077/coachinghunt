import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { cancelDemoRequest } from "@/modules/demo-requests/demo-requests.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const demoRequest = await cancelDemoRequest(id, auth.session.user.id);
    return successResponse(demoRequest, "Request cancelled");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

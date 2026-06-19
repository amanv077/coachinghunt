import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { respondToDemoRequest } from "@/modules/demo-requests/demo-requests.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const demoRequest = await respondToDemoRequest(id, auth.session.user.id, body);
    return successResponse(demoRequest, "Request updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

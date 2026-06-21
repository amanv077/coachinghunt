import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateBlogQueryStatus } from "@/modules/blog/blog.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status || !["PENDING", "CONTACTED", "FAKE"].includes(status)) {
      return errorResponse("Invalid status value", [], 400);
    }
    const updated = await updateBlogQueryStatus(id, status);
    return successResponse(updated, "Status updated successfully");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

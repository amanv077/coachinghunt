import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/auth/session";
import { deleteComment } from "@/modules/blog/blog.service";

export async function DELETE(request, { params }) {
  const auth = await requireAuth();
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { commentId } = await params;
    await deleteComment(commentId, auth.session.user.id, auth.session.user.role);
    return successResponse(null, "Comment deleted successfully");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

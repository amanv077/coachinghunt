import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/auth/session";
import { listComments, createComment } from "@/modules/blog/blog.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const comments = await listComments(id);
    return successResponse(comments);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function POST(request, { params }) {
  const auth = await requireAuth();
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return errorResponse("Comment content is required", [], 400);
    }

    const comment = await createComment({
      blogPostId: id,
      userId: auth.session.user.id,
      content: content.trim(),
    });

    return successResponse(comment, "Comment posted successfully", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

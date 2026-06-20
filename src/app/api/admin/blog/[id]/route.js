import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getPostById, updatePost, deletePost } from "@/modules/blog/blog.service";

export async function GET(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return errorResponse("Post not found", [], 404);
  return successResponse(post);
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const post = await updatePost(id, body);
    return successResponse(post, "Post updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    await deletePost(id);
    return successResponse(null, "Post deleted");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

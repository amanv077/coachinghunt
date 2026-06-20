import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listAllPosts, createPost } from "@/modules/blog/blog.service";

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);
  const posts = await listAllPosts();
  return successResponse(posts);
}

export async function POST(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const post = await createPost(body);
    return successResponse(post, "Post created", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

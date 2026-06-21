import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listBlogQueries } from "@/modules/blog/blog.service";

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const queries = await listBlogQueries();
    return successResponse(queries);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

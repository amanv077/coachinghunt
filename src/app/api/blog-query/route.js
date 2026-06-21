import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createBlogQuery } from "@/modules/blog/blog.service";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.phone || !body.blogSlug || !body.blogTitle) {
      return errorResponse("All fields are required", [], 400);
    }
    const query = await createBlogQuery(body);
    return successResponse(query, "Query submitted successfully", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

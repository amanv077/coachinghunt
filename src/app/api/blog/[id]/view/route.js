import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { incrementPostViews } from "@/modules/blog/blog.service";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const updated = await incrementPostViews(id);
    return successResponse({ views: updated.views }, "Views incremented");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

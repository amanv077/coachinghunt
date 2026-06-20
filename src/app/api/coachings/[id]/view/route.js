import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { recordProfileView } from "@/modules/coachings/coachings.service";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await recordProfileView(id);
    return successResponse(null, "View recorded");
  } catch (error) {
    return errorResponse("Failed to record view", [], 500);
  }
}

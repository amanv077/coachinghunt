import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listQA, askQuestion } from "@/modules/coaching-qa/coaching-qa.service";

export async function GET(request) {
  try {
    const coachingId = new URL(request.url).searchParams.get("coachingId");
    if (!coachingId) return errorResponse("coachingId is required", [], 400);
    const items = await listQA(coachingId);
    return successResponse(items);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { coachingId, question } = await request.json();
    const item = await askQuestion(auth.session.user.id, coachingId, question);
    return successResponse(item, "Question submitted", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

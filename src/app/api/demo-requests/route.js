import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import {
  createDemoRequest,
  getStudentDemoRequests,
  getCoachingDemoRequests,
} from "@/modules/demo-requests/demo-requests.service";

export async function POST(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const demoRequest = await createDemoRequest(auth.session.user.id, body);
    return successResponse(demoRequest, "Demo request sent", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function GET(request) {
  const auth = await requireAuth(["STUDENT", "COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const scope = new URL(request.url).searchParams.get("scope");
    if (scope === "coaching" && auth.session.user.role === "COACHING") {
      const requests = await getCoachingDemoRequests(auth.session.user.id);
      return successResponse(requests);
    }
    const requests = await getStudentDemoRequests(auth.session.user.id);
    return successResponse(requests);
  } catch (error) {
    return errorResponse("Failed to fetch demo requests", [], 500);
  }
}

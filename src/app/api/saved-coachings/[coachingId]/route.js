import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { saveCoaching, unsaveCoaching } from "@/modules/saved-coachings/saved-coachings.service";

export async function POST(request, { params }) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { coachingId } = await params;
    await saveCoaching(auth.session.user.id, coachingId);
    return successResponse(null, "Coaching saved");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { coachingId } = await params;
    await unsaveCoaching(auth.session.user.id, coachingId);
    return successResponse(null, "Coaching removed from saved list");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

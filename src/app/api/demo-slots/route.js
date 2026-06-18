import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createDemoSlot, listDemoSlots } from "@/modules/demo-slots/demo-slots.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await listDemoSlots({
      courseId: searchParams.get("courseId") || undefined,
      coachingId: searchParams.get("coachingId") || undefined,
      date: searchParams.get("date") || undefined,
      city: searchParams.get("city") || undefined,
      includePast: searchParams.get("includePast") === "true",
    });
    return successResponse(result);
  } catch (error) {
    return errorResponse("Failed to fetch demo slots", [], 500);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const coaching = await getCoachingByUserId(auth.session.user.id);
    if (!coaching) return errorResponse("Coaching profile required", [], 400);

    const body = await request.json();
    const slot = await createDemoSlot(coaching.id, body);
    return successResponse(slot, "Demo slot created", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

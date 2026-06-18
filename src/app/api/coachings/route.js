import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listPublicCoachings, getCoachingByUserId, updateCoachingProfile } from "@/modules/coachings/coachings.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await listPublicCoachings({
      q: searchParams.get("q") || undefined,
      city: searchParams.get("city") || undefined,
      locality: searchParams.get("locality") || undefined,
      subject: searchParams.get("subject") || undefined,
      targetExam: searchParams.get("targetExam") || undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 12),
      sort: searchParams.get("sort") || "newest",
    });
    return successResponse(result);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch coachings", [], 500);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const profile = await updateCoachingProfile(auth.session.user.id, body);
    return successResponse(profile, "Profile updated", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

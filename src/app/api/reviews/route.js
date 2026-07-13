import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createReview, listReviews } from "@/modules/reviews/reviews.service";

export async function POST(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const review = await createReview(auth.session.user.id, body);
    return successResponse(review, "Review submitted", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "APPROVED";

    if (status !== "APPROVED") {
      const auth = await requireAuth(["ADMIN"]);
      if (auth.error) return errorResponse(auth.error, [], auth.status);
    }

    const reviews = await listReviews({
      coachingId: searchParams.get("coachingId") || undefined,
      courseId: searchParams.get("courseId") || undefined,
      status,
    });
    return successResponse(reviews);
  } catch (error) {
    return errorResponse("Failed to fetch reviews", [], 500);
  }
}

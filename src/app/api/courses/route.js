import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { createCourse, listCourses } from "@/modules/courses/courses.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await listCourses({
      coachingId: searchParams.get("coachingId") || undefined,
      targetExam: searchParams.get("targetExam") || undefined,
      classLevel: searchParams.get("classLevel") || undefined,
      courseType: searchParams.get("courseType") || undefined,
    });
    return successResponse(result);
  } catch (error) {
    return errorResponse("Failed to fetch courses", [], 500);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const coaching = await getCoachingByUserId(auth.session.user.id);
    if (!coaching) return errorResponse("Coaching profile required", [], 400);

    const body = await request.json();
    const course = await createCourse(coaching.id, body);
    return successResponse(course, "Course created", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { getSession, requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getCourseBySlugOrId, updateCourse, archiveCourse } from "@/modules/courses/courses.service";
import { getCoachingByUserId } from "@/modules/coachings/coachings.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const course = await getCourseBySlugOrId(id, !!session?.user);
    if (!course) return errorResponse("Course not found", [], 404);
    return successResponse(course);
  } catch (error) {
    return errorResponse("Failed to fetch course", [], 500);
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const body = await request.json();
    const course = await updateCourse(id, coaching.id, body);
    return successResponse(course, "Course updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await getCoachingByUserId(auth.session.user.id);
    const course = await archiveCourse(id, coaching.id);
    return successResponse(course, "Course archived");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

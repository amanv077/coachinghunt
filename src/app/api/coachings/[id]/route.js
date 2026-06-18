import { getSession } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getCoachingBySlugOrId, updateCoachingProfile } from "@/modules/coachings/coachings.service";
import { prisma } from "@/lib/db/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const coaching = await getCoachingBySlugOrId(id, !!session?.user);
    if (!coaching) return errorResponse("Coaching not found", [], 404);
    return successResponse(coaching);
  } catch (error) {
    return errorResponse("Failed to fetch coaching", [], 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user || session.user.role !== "COACHING") {
      return errorResponse("Forbidden", [], 403);
    }

    const profile = await prisma.coachingProfile.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: session.user.id },
    });
    if (!profile) return errorResponse("Not found or unauthorized", [], 404);

    const body = await request.json();
    const updated = await updateCoachingProfile(session.user.id, body);
    return successResponse(updated, "Profile updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

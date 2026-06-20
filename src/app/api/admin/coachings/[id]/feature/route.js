import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/log";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const { isFeatured, featuredUntil, isPremium } = await request.json();

    const updated = await prisma.coachingProfile.update({
      where: { id },
      data: {
        ...(typeof isFeatured === "boolean" && { isFeatured }),
        ...(featuredUntil !== undefined && { featuredUntil: featuredUntil ? new Date(featuredUntil) : null }),
        ...(typeof isPremium === "boolean" && { isPremium }),
      },
    });

    await writeAuditLog({
      actorUserId: auth.session.user.id,
      actorRole: auth.session.user.role,
      action: "COACHING_FEATURE_UPDATED",
      entityType: "CoachingProfile",
      entityId: id,
      metaJson: { isFeatured, featuredUntil, isPremium },
    });

    return successResponse(updated, "Coaching updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { sendReviewInviteEmail } from "@/modules/notifications/email.service";
import { prisma } from "@/lib/db/prisma";

export async function POST(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const coaching = await prisma.coachingProfile.findUnique({ where: { userId: auth.session.user.id } });
    const booking = await prisma.booking.findFirst({
      where: { id, coachingId: coaching?.id },
      include: {
        student: { include: { user: true } },
        coaching: { select: { name: true, slug: true } },
      },
    });

    if (!booking) return errorResponse("Booking not found", [], 404);
    if (booking.reviewInviteSentAt) return errorResponse("Review invite already sent", [], 400);

    await sendReviewInviteEmail({
      studentEmail: booking.student.user.email,
      studentName: booking.student.user.name,
      coachingName: booking.coaching.name,
      coachingSlug: booking.coaching.slug,
    });

    await prisma.booking.update({
      where: { id },
      data: { reviewInviteSentAt: new Date() },
    });

    return successResponse(null, "Review invite sent");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

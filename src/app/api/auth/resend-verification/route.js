import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { prisma } from "@/lib/db/prisma";
import { sendEmailVerification } from "@/modules/auth/verification.service";

export async function POST() {
  const auth = await requireAuth(["STUDENT", "COACHING", "ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const user = await prisma.user.findUnique({ where: { id: auth.session.user.id } });
  if (!user) return errorResponse("User not found", [], 404);
  if (user.emailVerifiedAt) return successResponse({ sent: false }, "Email already verified");

  try {
    await sendEmailVerification(user);
    return successResponse({ sent: true }, "Verification email sent");
  } catch (error) {
    console.error(error);
    return errorResponse("Could not send verification email", [], 500);
  }
}

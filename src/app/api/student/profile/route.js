import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: auth.session.user.id },
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
  return successResponse(profile);
}

export async function PATCH(request) {
  const auth = await requireAuth(["STUDENT"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const body = await request.json();
  const profile = await prisma.studentProfile.update({
    where: { userId: auth.session.user.id },
    data: body,
  });
  return successResponse(profile, "Profile updated");
}

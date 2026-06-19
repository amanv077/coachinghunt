import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { prisma } from "@/lib/db/prisma";

const updateSchema = z.object({
  city: z
    .union([z.string().min(2), z.literal("")])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  classLevel: z
    .union([z.string(), z.literal("")])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  targetExams: z.array(z.string().min(1)).optional(),
  schoolName: z
    .union([z.string(), z.literal("")])
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  preferredSubjects: z.array(z.string()).optional(),
});

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
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", parsed.error.errors, 422);
  }

  const profile = await prisma.studentProfile.update({
    where: { userId: auth.session.user.id },
    data: parsed.data,
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
  return successResponse(profile, "Profile updated");
}

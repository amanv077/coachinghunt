import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listQA } from "@/modules/coaching-qa/coaching-qa.service";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const items = await prisma.coachingQA.findMany({
    where: { status: "PENDING" },
    include: {
      coaching: { select: { name: true, slug: true } },
      askedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse(items);
}

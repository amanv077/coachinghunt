import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { prisma } from "@/lib/db/prisma";

export async function GET(request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 50);
  const skip = (page - 1) * limit;

  const where = {
    ...(searchParams.get("actorRole") && { actorRole: searchParams.get("actorRole") }),
    ...(searchParams.get("entityType") && { entityType: searchParams.get("entityType") }),
  };

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return successResponse({ items, total, page, totalPages: Math.ceil(total / limit) });
}

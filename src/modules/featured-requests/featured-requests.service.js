import { prisma } from "@/lib/db/prisma";

export async function createFeaturedRequest(coachingUserId, note) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const existing = await prisma.featuredRequest.findFirst({
    where: { coachingId: coaching.id, status: "PENDING" },
  });
  if (existing) throw new Error("You already have a pending featured request");

  return prisma.featuredRequest.create({
    data: {
      coachingId: coaching.id,
      note: note?.trim() || null,
    },
    include: { coaching: { select: { name: true } } },
  });
}

export async function listFeaturedRequests({ status = "PENDING" } = {}) {
  return prisma.featuredRequest.findMany({
    where: { status },
    include: {
      coaching: {
        select: { id: true, name: true, city: true, slug: true, user: { select: { email: true } } },
      },
    },
    orderBy: { requestedAt: "desc" },
  });
}

export async function getCoachingFeaturedRequest(coachingUserId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) return null;

  return prisma.featuredRequest.findFirst({
    where: { coachingId: coaching.id },
    orderBy: { requestedAt: "desc" },
  });
}

export async function respondToFeaturedRequest(requestId, { status, adminNote }) {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid status");
  }

  const request = await prisma.featuredRequest.findUnique({
    where: { id: requestId },
    include: { coaching: true },
  });
  if (!request || request.status !== "PENDING") {
    throw new Error("Request not found or already handled");
  }

  const featuredUntil =
    status === "APPROVED" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

  const [updated] = await prisma.$transaction([
    prisma.featuredRequest.update({
      where: { id: requestId },
      data: {
        status,
        adminNote: adminNote?.trim() || null,
        reviewedAt: new Date(),
      },
    }),
    ...(status === "APPROVED"
      ? [
          prisma.coachingProfile.update({
            where: { id: request.coachingId },
            data: { isFeatured: true, featuredUntil },
          }),
        ]
      : []),
  ]);

  return updated;
}

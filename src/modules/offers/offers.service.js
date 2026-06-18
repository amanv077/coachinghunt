import { prisma } from "@/lib/db/prisma";

export async function listActiveOffers(coachingId) {
  const now = new Date();
  return prisma.offer.findMany({
    where: {
      status: "ACTIVE",
      validFrom: { lte: now },
      validTill: { gte: now },
      ...(coachingId && { coachingId }),
    },
    include: { coaching: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOffer(coachingId, data) {
  return prisma.offer.create({
    data: {
      coachingId,
      title: data.title,
      description: data.description,
      validFrom: new Date(data.validFrom),
      validTill: new Date(data.validTill),
      status: "ACTIVE",
    },
  });
}

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

export async function listCoachOffers(coachingId) {
  return prisma.offer.findMany({
    where: { coachingId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOffer(coachingId, data) {
  return prisma.offer.create({
    data: {
      coachingId,
      title: data.title,
      description: data.description,
      promoCode: data.promoCode || null,
      validFrom: new Date(data.validFrom),
      validTill: new Date(data.validTill),
      status: "ACTIVE",
    },
  });
}

export async function updateOffer(offerId, coachingId, data) {
  const offer = await prisma.offer.findFirst({ where: { id: offerId, coachingId } });
  if (!offer) throw new Error("Offer not found");

  return prisma.offer.update({
    where: { id: offerId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.promoCode !== undefined && { promoCode: data.promoCode || null }),
      ...(data.validFrom && { validFrom: new Date(data.validFrom) }),
      ...(data.validTill && { validTill: new Date(data.validTill) }),
      ...(data.status && { status: data.status }),
    },
  });
}

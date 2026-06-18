import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/helpers";

export async function listPublicCoachings({ q, city, locality, subject, targetExam, page = 1, limit = 12, sort = "newest" }) {
  const where = {
    listingStatus: "ACTIVE",
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(locality && { locality: { contains: locality, mode: "insensitive" } }),
    ...(targetExam && { targetExams: { has: targetExam } }),
    ...(subject && { subjects: { has: subject } }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { locality: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy = sort === "rating" ? { avgRating: "desc" } : { createdAt: "desc" };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.coachingProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        city: true,
        locality: true,
        category: true,
        targetExams: true,
        subjects: true,
        logoUrl: true,
        coverImageUrl: true,
        avgRating: true,
        reviewCount: true,
        verificationStatus: true,
      },
    }),
    prisma.coachingProfile.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCoachingBySlugOrId(identifier, isAuthenticated = false) {
  const coaching = await prisma.coachingProfile.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      listingStatus: { in: isAuthenticated ? ["ACTIVE", "DRAFT", "PAUSED"] : ["ACTIVE"] },
    },
    include: {
      courses: {
        where: { status: "ACTIVE" },
        take: isAuthenticated ? undefined : 3,
      },
      demoSlots: {
        where: { status: { in: ["OPEN", "FULL"] }, demoDate: { gte: new Date() } },
        orderBy: { demoDate: "asc" },
        take: isAuthenticated ? undefined : 5,
      },
      reviews: {
        where: { status: "APPROVED" },
        take: 5,
        include: { student: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  if (!coaching) return null;

  if (!isAuthenticated) {
    return {
      ...coaching,
      description: coaching.description?.slice(0, 200) + (coaching.description?.length > 200 ? "..." : ""),
      email: undefined,
      phone: undefined,
      alternatePhone: undefined,
      addressLine1: undefined,
      addressLine2: undefined,
    };
  }

  return coaching;
}

export async function getCoachingByUserId(userId) {
  return prisma.coachingProfile.findUnique({
    where: { userId },
    include: { branches: true, courses: true },
  });
}

export async function updateCoachingProfile(userId, data) {
  const profile = await prisma.coachingProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Profile not found");

  return prisma.coachingProfile.update({
    where: { userId },
    data: {
      ...data,
      ...(data.name && !data.slug && { slug: slugify(data.name) + "-" + profile.id.slice(-6) }),
    },
  });
}

export async function getFeaturedCoachings(limit = 6) {
  return prisma.coachingProfile.findMany({
    where: { listingStatus: "ACTIVE", verificationStatus: "VERIFIED" },
    orderBy: { avgRating: "desc" },
    take: limit,
  });
}

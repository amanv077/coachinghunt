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

  const [rows, total] = await Promise.all([
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
        description: true,
        city: true,
        locality: true,
        category: true,
        mode: true,
        foundedYear: true,
        targetExams: true,
        subjects: true,
        facilities: true,
        logoUrl: true,
        coverImageUrl: true,
        avgRating: true,
        reviewCount: true,
        verificationStatus: true,
        avgResponseHours: true,
        _count: {
          select: {
            demoSlots: {
              where: { status: "OPEN", demoDate: { gte: new Date() } },
            },
            courses: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    }),
    prisma.coachingProfile.count({ where }),
  ]);

  const items = rows.map(({ _count, ...coaching }) => ({
    ...coaching,
    openDemoCount: _count.demoSlots,
    courseCount: _count.courses,
  }));

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
      },
      branches: true,
      demoSlots: {
        where: { status: { in: ["OPEN", "FULL"] }, demoDate: { gte: new Date() } },
        orderBy: { demoDate: "asc" },
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
      email: undefined,
      phone: undefined,
      alternatePhone: undefined,
      addressLine1: undefined,
      addressLine2: undefined,
      pincode: undefined,
      website: undefined,
      latitude: undefined,
      longitude: undefined,
      courses: coaching.courses?.map((course) => ({
        ...course,
        fees: undefined,
        discountedFees: undefined,
        scheduleSummary: undefined,
        batchSize: undefined,
        facultySummary: undefined,
        description: course.description?.slice(0, 120) + (course.description?.length > 120 ? "…" : ""),
      })),
      demoSlots: coaching.demoSlots?.map((slot) => ({
        id: slot.id,
        topic: slot.topic,
        demoDate: slot.demoDate,
        status: slot.status,
      })),
    };
  }

  return coaching;
}

export async function getCoachingByUserId(userId) {
  const profile = await prisma.coachingProfile.findUnique({
    where: { userId },
    include: {
      branches: true,
      courses: true,
      _count: { select: { courses: true, demoSlots: true } },
    },
  });

  if (!profile) return null;

  const { _count, ...rest } = profile;
  return {
    ...rest,
    completeness: getProfileCompleteness(profile, {
      courseCount: _count.courses,
      demoSlotCount: _count.demoSlots,
    }),
  };
}

export function getProfileCompleteness(profile, { courseCount = 0, demoSlotCount = 0 } = {}) {
  const checks = [
    { label: "Institute name", done: !!profile.name },
    { label: "Tagline", done: !!profile.tagline },
    { label: "Description", done: !!profile.description?.trim() },
    { label: "City", done: !!profile.city },
    { label: "Target exams", done: profile.targetExams?.length > 0 },
    { label: "Logo", done: !!profile.logoUrl },
    { label: "Cover photo", done: !!profile.coverImageUrl },
    { label: "Phone", done: !!profile.phone },
    { label: "Add a course", done: courseCount > 0 },
    { label: "Create a demo slot", done: demoSlotCount > 0 },
  ];

  const doneCount = checks.filter((c) => c.done).length;
  const score = Math.round((doneCount / checks.length) * 100);
  const missing = checks.filter((c) => !c.done).map((c) => c.label);

  return { score, missing };
}

export async function computeAvgResponseHours(coachingId) {
  const requests = await prisma.demoRequest.findMany({
    where: {
      coachingId,
      status: { in: ["APPROVED", "RESCHEDULED", "DECLINED"] },
    },
    select: { createdAt: true, updatedAt: true },
  });

  if (requests.length < 3) return null;

  const totalHours = requests.reduce((sum, req) => {
    const hours = (req.updatedAt - req.createdAt) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  return Math.round((totalHours / requests.length) * 10) / 10;
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
    include: {
      _count: { select: { courses: true, demoSlots: true } },
    },
  }).then((updated) => {
    const { _count, ...rest } = updated;
    return {
      ...rest,
      completeness: getProfileCompleteness(updated, {
        courseCount: _count.courses,
        demoSlotCount: _count.demoSlots,
      }),
    };
  });
}

export async function getPlatformStats() {
  const [coachingCount, bookingCount, cities] = await Promise.all([
    prisma.coachingProfile.count({ where: { listingStatus: "ACTIVE" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.coachingProfile.findMany({
      where: { listingStatus: "ACTIVE", city: { not: null } },
      select: { city: true },
      distinct: ["city"],
    }),
  ]);

  return {
    coachings: coachingCount,
    bookings: bookingCount,
    cities: cities.length,
  };
}

export async function getFeaturedReviews(limit = 3) {
  return prisma.review.findMany({
    where: { status: "APPROVED", comment: { not: null } },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      student: { include: { user: { select: { name: true } } } },
      coaching: { select: { name: true, city: true, targetExams: true } },
    },
  });
}

export async function getFeaturedCoachings(limit = 6) {
  const rows = await prisma.coachingProfile.findMany({
    where: { listingStatus: "ACTIVE", verificationStatus: "VERIFIED" },
    orderBy: { avgRating: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      description: true,
      city: true,
      locality: true,
      category: true,
      mode: true,
      foundedYear: true,
      targetExams: true,
      subjects: true,
      facilities: true,
      logoUrl: true,
      coverImageUrl: true,
      avgRating: true,
      reviewCount: true,
      verificationStatus: true,
      avgResponseHours: true,
      _count: {
        select: {
          demoSlots: {
            where: { status: "OPEN", demoDate: { gte: new Date() } },
          },
          courses: {
            where: { status: "ACTIVE" },
          },
        },
      },
    },
  });

  return rows.map(({ _count, ...coaching }) => ({
    ...coaching,
    openDemoCount: _count.demoSlots,
    courseCount: _count.courses,
  }));
}

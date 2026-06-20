import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/helpers";

const coachingCardSelect = {
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
  isFeatured: true,
  featuredUntil: true,
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
};

function mapCoachingRow({ _count, ...coaching }) {
  return {
    ...coaching,
    openDemoCount: _count.demoSlots,
    courseCount: _count.courses,
  };
}

function isCurrentlyFeatured(coaching) {
  if (!coaching.isFeatured) return false;
  if (!coaching.featuredUntil) return true;
  return new Date(coaching.featuredUntil) >= new Date();
}

export async function listPublicCoachings({
  q,
  city,
  locality,
  subject,
  targetExam,
  maxFee,
  page = 1,
  limit = 12,
  sort = "newest",
}) {
  const now = new Date();
  const where = {
    listingStatus: "ACTIVE",
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(locality && { locality: { contains: locality, mode: "insensitive" } }),
    ...(targetExam && { targetExams: { has: targetExam } }),
    ...(subject && { subjects: { has: subject } }),
    ...(maxFee && {
      courses: {
        some: {
          status: "ACTIVE",
          OR: [
            { fees: { lte: Number(maxFee) } },
            { discountedFees: { lte: Number(maxFee) } },
          ],
        },
      },
    }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { locality: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy =
    sort === "rating"
      ? [{ isFeatured: "desc" }, { avgRating: "desc" }]
      : [{ isFeatured: "desc" }, { createdAt: "desc" }];

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    prisma.coachingProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: coachingCardSelect,
    }),
    prisma.coachingProfile.count({ where }),
  ]);

  const items = rows.map(mapCoachingRow).map((coaching) => ({
    ...coaching,
    isFeatured: isCurrentlyFeatured(coaching),
  }));

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getExamCoachingCounts() {
  const coachings = await prisma.coachingProfile.findMany({
    where: { listingStatus: "ACTIVE" },
    select: { targetExams: true },
  });

  const counts = {};
  coachings.forEach((c) => {
    c.targetExams.forEach((exam) => {
      counts[exam] = (counts[exam] || 0) + 1;
    });
  });
  return counts;
}

export async function getCityExamCombos() {
  const coachings = await prisma.coachingProfile.findMany({
    where: { listingStatus: "ACTIVE", city: { not: null } },
    select: { city: true, targetExams: true },
  });

  const combos = new Map();
  coachings.forEach(({ city, targetExams }) => {
    targetExams.forEach((exam) => {
      const key = `${exam}::${city}`;
      combos.set(key, { exam, city, count: (combos.get(key)?.count || 0) + 1 });
    });
  });
  return [...combos.values()];
}

export async function recordProfileView(coachingId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.profileView.upsert({
    where: {
      coachingId_date: { coachingId, date: today },
    },
    create: { coachingId, date: today, viewCount: 1 },
    update: { viewCount: { increment: 1 } },
  });
}

export async function getCoachingBySlugOrId(identifier, isAuthenticated = false) {
  const coaching = await prisma.coachingProfile.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      listingStatus: { in: isAuthenticated ? ["ACTIVE", "DRAFT", "PAUSED"] : ["ACTIVE"] },
    },
    include: {
      courses: { where: { status: "ACTIVE" } },
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

  const result = {
    ...coaching,
    isFeatured: isCurrentlyFeatured(coaching),
  };

  if (!isAuthenticated) {
    return {
      ...result,
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

  return result;
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

  return prisma.coachingProfile
    .update({
      where: { userId },
      data: {
        ...data,
        ...(data.name && !data.slug && { slug: slugify(data.name) + "-" + profile.id.slice(-6) }),
      },
      include: {
        _count: { select: { courses: true, demoSlots: true } },
      },
    })
    .then((updated) => {
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
  const now = new Date();
  const rows = await prisma.coachingProfile.findMany({
    where: {
      listingStatus: "ACTIVE",
      isFeatured: true,
      OR: [{ featuredUntil: null }, { featuredUntil: { gte: now } }],
    },
    orderBy: { avgRating: "desc" },
    take: limit,
    select: coachingCardSelect,
  });

  if (rows.length < limit) {
    const existingIds = rows.map((r) => r.id);
    const fallback = await prisma.coachingProfile.findMany({
      where: {
        listingStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        id: { notIn: existingIds },
      },
      orderBy: { avgRating: "desc" },
      take: limit - rows.length,
      select: coachingCardSelect,
    });
    rows.push(...fallback);
  }

  return rows.map(mapCoachingRow).map((coaching) => ({
    ...coaching,
    isFeatured: isCurrentlyFeatured(coaching),
  }));
}

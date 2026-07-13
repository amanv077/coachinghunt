import { prisma } from "@/lib/db/prisma";
import { getProfileCompleteness } from "@/modules/coachings/coachings.service";

export async function getAdminAnalytics() {
  const [totalStudents, totalCoachings, activeCourses, activeDemoSlots, totalBookings, bookingsByCity, leadCounts] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.coachingProfile.count(),
      prisma.course.count({ where: { status: "ACTIVE" } }),
      prisma.demoSlot.count({ where: { status: "OPEN" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.groupBy({
        by: ["coachingId"],
        _count: true,
        where: { status: "CONFIRMED" },
      }),
      prisma.demoRequest.groupBy({
        by: ["coachingId", "isPaidLead"],
        _count: true,
      }),
    ]);

  const coachingIds = [...new Set([
    ...bookingsByCity.map((b) => b.coachingId),
    ...leadCounts.map((l) => l.coachingId),
  ])];
  const coachings = await prisma.coachingProfile.findMany({
    where: { id: { in: coachingIds } },
    select: { id: true, city: true, name: true },
  });

  const cityMap = {};
  bookingsByCity.forEach((b) => {
    const coaching = coachings.find((c) => c.id === b.coachingId);
    const city = coaching?.city || "Unknown";
    cityMap[city] = (cityMap[city] || 0) + b._count;
  });

  const leadMap = {};
  leadCounts.forEach((row) => {
    if (!leadMap[row.coachingId]) {
      leadMap[row.coachingId] = { total: 0, paid: 0 };
    }
    leadMap[row.coachingId].total += row._count;
    if (row.isPaidLead) leadMap[row.coachingId].paid += row._count;
  });

  const leadsByCoaching = Object.entries(leadMap)
    .map(([coachingId, counts]) => {
      const coaching = coachings.find((c) => c.id === coachingId);
      return {
        coachingId,
        name: coaching?.name || "Unknown",
        city: coaching?.city || "—",
        totalLeads: counts.total,
        paidLeads: counts.paid,
      };
    })
    .sort((a, b) => b.totalLeads - a.totalLeads);

  return {
    totalStudents,
    totalCoachings,
    activeCourses,
    activeDemoSlots,
    totalBookings,
    bookingsByCity: Object.entries(cityMap).map(([city, count]) => ({ city, count })),
    leadsByCoaching,
  };
}

export async function listUsers(page = 1, limit = 20, search = "") {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function listCoachingsAdmin(page = 1, limit = 20, search = "") {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.coachingProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, isActive: true } } },
    }),
    prisma.coachingProfile.count({ where }),
  ]);

  const now = new Date();
  const normalized = items.map((coaching) => ({
    ...coaching,
    isFeatured: coaching.isFeatured && (!coaching.featuredUntil || coaching.featuredUntil > now),
  }));

  return { items: normalized, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateCoachingVerification(id, verificationStatus) {
  return prisma.coachingProfile.update({
    where: { id },
    data: {
      verificationStatus,
      ...(verificationStatus === "VERIFIED" && { listingStatus: "ACTIVE" }),
    },
  });
}

export async function updateUserStatus(id, isActive) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}

export async function getStudentDashboard(userId) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { savedCoachings: { include: { coaching: true } } },
  });
  if (!student) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const savedCoachingIds = student.savedCoachings.map((s) => s.coachingId);
  const savedExams = [...new Set(student.savedCoachings.flatMap((s) => s.coaching.targetExams || []))];
  const savedCities = [...new Set(student.savedCoachings.map((s) => s.coaching.city).filter(Boolean))];

  const [bookedCoachingIds, reviewedCoachingIds] = await Promise.all([
    prisma.booking.findMany({
      where: { studentId: student.id },
      select: { coachingId: true },
    }).then((rows) => rows.map((r) => r.coachingId)),
    prisma.review.findMany({
      where: { studentId: student.id },
      select: { coachingId: true },
    }).then((rows) => rows.map((r) => r.coachingId)),
  ]);

  const excludeIds = [...new Set([...savedCoachingIds, ...bookedCoachingIds])];

  const targetExams = [...new Set([...(student.targetExams || []), ...savedExams])];
  const cities = [...new Set([student.city, ...savedCities].filter(Boolean))];

  const personalisedWhere = {
    listingStatus: "ACTIVE",
    verificationStatus: "VERIFIED",
    id: { notIn: excludeIds },
    ...(cities.length > 0
      ? { OR: cities.map((city) => ({ city: { contains: city, mode: "insensitive" } })) }
      : {}),
    ...(targetExams.length > 0 ? { targetExams: { hasSome: targetExams } } : {}),
  };

  const [upcomingBookings, attendedCount, allOffers, personalisedCoachings, referralCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        studentId: student.id,
        status: "CONFIRMED",
        demoSlot: { demoDate: { gte: today } },
      },
      include: { demoSlot: true, coaching: true, course: true },
      orderBy: { demoSlot: { demoDate: "asc" } },
      take: 5,
    }),
    prisma.booking.count({
      where: { studentId: student.id, status: "ATTENDED" },
    }),
    prisma.offer.findMany({
      where: { status: "ACTIVE", validTill: { gte: new Date() } },
      include: { coaching: { select: { name: true, slug: true, id: true } } },
      orderBy: { validTill: "asc" },
    }),
    prisma.coachingProfile.findMany({
      where: personalisedWhere,
      orderBy: { avgRating: "desc" },
      take: 4,
    }),
    prisma.referral.count({ where: { referrerId: student.id, status: "COMPLETED" } }),
  ]);

  const savedOffers = allOffers.filter((o) => savedCoachingIds.includes(o.coachingId));
  const otherOffers = allOffers.filter((o) => !savedCoachingIds.includes(o.coachingId));
  const offers = [...savedOffers, ...otherOffers].slice(0, 4);

  let topCoachings = personalisedCoachings;
  if (topCoachings.length === 0) {
    topCoachings = await prisma.coachingProfile.findMany({
      where: {
        listingStatus: "ACTIVE",
        verificationStatus: "VERIFIED",
        id: { notIn: excludeIds },
      },
      orderBy: { avgRating: "desc" },
      take: 4,
    });
  }

  return {
    profile: student,
    upcomingBookings,
    attendedCount,
    offers,
    topCoachings,
    referralCount,
    referralCode: student.referralCode,
    reviewedCoachingIds,
  };
}

export async function getCoachingDashboard(userId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId } });
  if (!coaching) return null;

  const [courseCount, activeDemoSlots, bookingSummary, recentBookings] = await Promise.all([
    prisma.course.count({ where: { coachingId: coaching.id, status: "ACTIVE" } }),
    prisma.demoSlot.count({ where: { coachingId: coaching.id, status: "OPEN" } }),
    prisma.booking.count({ where: { coachingId: coaching.id, status: "CONFIRMED" } }),
    prisma.booking.findMany({
      where: { coachingId: coaching.id },
      include: { student: { include: { user: { select: { name: true, email: true } } } }, demoSlot: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const completeness = getProfileCompleteness(coaching, {
    courseCount,
    demoSlotCount: activeDemoSlots,
  });

  return { profile: coaching, courseCount, activeDemoSlots, bookingSummary, recentBookings, completeness };
}

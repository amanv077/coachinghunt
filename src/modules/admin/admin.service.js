import { prisma } from "@/lib/db/prisma";

export async function getAdminAnalytics() {
  const [totalStudents, totalCoachings, activeCourses, activeDemoSlots, totalBookings, bookingsByCity] =
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
    ]);

  const coachingIds = bookingsByCity.map((b) => b.coachingId);
  const coachings = await prisma.coachingProfile.findMany({
    where: { id: { in: coachingIds } },
    select: { id: true, city: true },
  });

  const cityMap = {};
  bookingsByCity.forEach((b) => {
    const coaching = coachings.find((c) => c.id === b.coachingId);
    const city = coaching?.city || "Unknown";
    cityMap[city] = (cityMap[city] || 0) + b._count;
  });

  return {
    totalStudents,
    totalCoachings,
    activeCourses,
    activeDemoSlots,
    totalBookings,
    bookingsByCity: Object.entries(cityMap).map(([city, count]) => ({ city, count })),
  };
}

export async function listUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count(),
  ]);
  return { items, total, page, limit };
}

export async function listCoachingsAdmin(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.coachingProfile.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, isActive: true } } },
    }),
    prisma.coachingProfile.count(),
  ]);
  return { items, total, page, limit };
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
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) return null;

  const [bookings, offers, topCoachings] = await Promise.all([
    prisma.booking.findMany({
      where: { studentId: student.id, status: "CONFIRMED" },
      include: { demoSlot: true, coaching: true, course: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.offer.findMany({
      where: { status: "ACTIVE", validTill: { gte: new Date() } },
      take: 4,
      include: { coaching: { select: { name: true } } },
    }),
    prisma.coachingProfile.findMany({
      where: { listingStatus: "ACTIVE" },
      orderBy: { avgRating: "desc" },
      take: 4,
    }),
  ]);

  return { profile: student, bookings, offers, topCoachings };
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

  return { profile: coaching, courseCount, activeDemoSlots, bookingSummary, recentBookings };
}

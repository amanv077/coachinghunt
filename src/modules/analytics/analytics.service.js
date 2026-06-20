import { prisma } from "@/lib/db/prisma";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

export async function getCoachingAnalytics(coachingUserId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const since30 = daysAgo(30);
  const since56 = daysAgo(56);

  const [views, bookings, requests, enrolled, topCourses, cityBookings, cityCoachings] =
    await Promise.all([
      prisma.profileView.findMany({
        where: { coachingId: coaching.id, date: { gte: since30 } },
        orderBy: { date: "asc" },
      }),
      prisma.booking.findMany({
        where: { coachingId: coaching.id, createdAt: { gte: since56 } },
        select: { createdAt: true, status: true },
      }),
      prisma.demoRequest.count({ where: { coachingId: coaching.id } }),
      prisma.demoRequest.count({ where: { coachingId: coaching.id, leadStatus: "ENROLLED" } }),
      prisma.booking.groupBy({
        by: ["courseId"],
        where: { coachingId: coaching.id },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      coaching.city
        ? prisma.booking.count({
            where: { coaching: { city: coaching.city }, status: "CONFIRMED" },
          })
        : Promise.resolve(0),
      coaching.city
        ? prisma.coachingProfile.count({
            where: { city: coaching.city, listingStatus: "ACTIVE" },
          })
        : Promise.resolve(0),
    ]);

  const courseIds = topCourses.map((c) => c.courseId);
  const courses = courseIds.length
    ? await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true },
      })
    : [];

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  const profileViewsSeries = views.map((v) => ({
    date: v.date.toISOString().slice(0, 10),
    views: v.viewCount,
  }));

  const bookingsByWeek = {};
  bookings.forEach((b) => {
    const weekStart = startOfDay(b.createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    bookingsByWeek[key] = (bookingsByWeek[key] || 0) + 1;
  });

  const bookingsSeries = Object.entries(bookingsByWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  let competitorAvgRating = null;
  if (coaching.city) {
    const agg = await prisma.coachingProfile.aggregate({
      where: { city: coaching.city, listingStatus: "ACTIVE", id: { not: coaching.id } },
      _avg: { avgRating: true },
    });
    competitorAvgRating = agg._avg.avgRating;
  }

  return {
    coaching: {
      id: coaching.id,
      name: coaching.name,
      isPremium: coaching.isPremium,
      city: coaching.city,
      avgRating: coaching.avgRating,
    },
    profileViewsSeries,
    bookingsSeries,
    funnel: {
      views: views.reduce((sum, v) => sum + v.viewCount, 0),
      requests,
      bookings: totalBookings,
      enrolled,
    },
    topCourses: topCourses.map((c) => ({
      title: courseMap[c.courseId] || "Unknown",
      count: c._count.id,
    })),
    summary: {
      totalBookings,
      confirmedBookings,
      conversionRate: requests > 0 ? Math.round((confirmedBookings / requests) * 100) : 0,
    },
    premium: coaching.isPremium
      ? {
          competitorAvgRating,
          cityBookingShare: cityCoachings > 0 ? Math.round((cityBookings / cityCoachings) * 10) / 10 : 0,
          monthOverMonthGrowth: bookingsSeries.length >= 2
            ? Math.round(
                ((bookingsSeries[bookingsSeries.length - 1]?.count || 0) -
                  (bookingsSeries[bookingsSeries.length - 2]?.count || 0)) /
                  Math.max(bookingsSeries[bookingsSeries.length - 2]?.count || 1, 1) *
                  100
              )
            : 0,
        }
      : null,
  };
}

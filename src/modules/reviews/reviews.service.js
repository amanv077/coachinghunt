import { prisma } from "@/lib/db/prisma";

export async function createReview(studentUserId, data) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  const rating = Number(data.rating);
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const existing = await prisma.review.findUnique({
    where: { studentId_coachingId: { studentId: student.id, coachingId: data.coachingId } },
  });
  if (existing) throw new Error("You have already reviewed this coaching");

  const booking = await prisma.booking.findFirst({
    where: {
      studentId: student.id,
      coachingId: data.coachingId,
      status: "ATTENDED",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!booking) {
    throw new Error("You can only review coachings after attending a demo");
  }

  return prisma.review.create({
    data: {
      studentId: student.id,
      coachingId: data.coachingId,
      courseId: data.courseId || booking.courseId,
      bookingId: booking.id,
      rating,
      title: data.title,
      comment: data.comment,
      status: "PENDING",
    },
  });
}

export async function listReviews(filters = {}) {
  return prisma.review.findMany({
    where: {
      ...(filters.coachingId && { coachingId: filters.coachingId }),
      ...(filters.courseId && { courseId: filters.courseId }),
      status: filters.status || "APPROVED",
    },
    include: {
      student: { include: { user: { select: { name: true } } } },
      booking: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveReview(reviewId, status) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  if (status === "APPROVED" || status === "REJECTED") {
    const stats = await prisma.review.aggregate({
      where: { coachingId: review.coachingId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.coachingProfile.update({
      where: { id: review.coachingId },
      data: {
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });
  }

  return review;
}

export async function studentCanReviewCoaching(studentUserId, coachingId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) return false;

  const [booking, existingReview] = await Promise.all([
    prisma.booking.findFirst({
      where: {
        studentId: student.id,
        coachingId,
        status: "ATTENDED",
      },
    }),
    prisma.review.findUnique({
      where: { studentId_coachingId: { studentId: student.id, coachingId } },
    }),
  ]);

  return !!booking && !existingReview;
}

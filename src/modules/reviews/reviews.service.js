import { prisma } from "@/lib/db/prisma";

export async function createReview(studentUserId, data) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  return prisma.review.create({
    data: {
      studentId: student.id,
      coachingId: data.coachingId,
      courseId: data.courseId,
      rating: data.rating,
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
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveReview(reviewId, status) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  if (status === "APPROVED") {
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

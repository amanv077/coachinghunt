import { prisma } from "@/lib/db/prisma";

export async function getSavedCoachingIds(studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) return [];

  const rows = await prisma.savedCoaching.findMany({
    where: { studentId: student.id },
    select: { coachingId: true },
  });

  return rows.map((r) => r.coachingId);
}

export async function listSavedCoachings(studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) return [];

  const rows = await prisma.savedCoaching.findMany({
    where: { studentId: student.id },
    include: {
      coaching: {
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
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => r.coaching);
}

export async function saveCoaching(studentUserId, coachingId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  const coaching = await prisma.coachingProfile.findFirst({
    where: { id: coachingId, listingStatus: "ACTIVE" },
  });
  if (!coaching) throw new Error("Coaching not found");

  return prisma.savedCoaching.upsert({
    where: { studentId_coachingId: { studentId: student.id, coachingId } },
    create: { studentId: student.id, coachingId },
    update: {},
  });
}

export async function unsaveCoaching(studentUserId, coachingId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  await prisma.savedCoaching.deleteMany({
    where: { studentId: student.id, coachingId },
  });
}

import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/helpers";

export async function createCourse(coachingId, data) {
  const slug = slugify(data.title) + "-" + Date.now().toString(36);
  return prisma.course.create({
    data: { ...data, coachingId, slug },
  });
}

export async function updateCourse(courseId, coachingId, data) {
  const course = await prisma.course.findFirst({ where: { id: courseId, coachingId } });
  if (!course) throw new Error("Course not found");
  return prisma.course.update({ where: { id: courseId }, data });
}

export async function archiveCourse(courseId, coachingId) {
  const course = await prisma.course.findFirst({ where: { id: courseId, coachingId } });
  if (!course) throw new Error("Course not found");
  return prisma.course.update({ where: { id: courseId }, data: { status: "ARCHIVED" } });
}

export async function listCourses(filters = {}) {
  const where = {
    status: filters.status || "ACTIVE",
    ...(filters.coachingId && { coachingId: filters.coachingId }),
    ...(filters.targetExam && { targetExam: filters.targetExam }),
    ...(filters.classLevel && { classLevel: filters.classLevel }),
    ...(filters.courseType && { courseType: filters.courseType }),
  };

  return prisma.course.findMany({
    where,
    include: { coaching: { select: { name: true, slug: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseBySlugOrId(identifier, isAuthenticated = false) {
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      status: isAuthenticated ? undefined : "ACTIVE",
    },
    include: {
      coaching: true,
      demoSlots: {
        where: { status: { in: ["OPEN", "FULL"] }, demoDate: { gte: new Date() } },
        orderBy: { demoDate: "asc" },
      },
    },
  });

  if (!course || !isAuthenticated) {
    return course;
  }

  return course;
}

export async function getCoursesByCoachingId(coachingId) {
  return prisma.course.findMany({
    where: { coachingId, status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
  });
}

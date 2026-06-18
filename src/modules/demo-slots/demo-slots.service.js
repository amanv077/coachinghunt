import { prisma } from "@/lib/db/prisma";

export async function createDemoSlot(coachingId, data) {
  const course = await prisma.course.findFirst({
    where: { id: data.courseId, coachingId },
  });
  if (!course) throw new Error("Invalid course");

  const demoDate = new Date(data.demoDate);
  if (demoDate < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new Error("Demo date cannot be in the past");
  }

  if (data.endTime <= data.startTime) {
    throw new Error("End time must be later than start time");
  }

  return prisma.demoSlot.create({
    data: {
      ...data,
      coachingId,
      demoDate,
      capacity: Number(data.capacity),
      durationMinutes: Number(data.durationMinutes),
    },
  });
}

export async function updateDemoSlot(slotId, coachingId, data) {
  const slot = await prisma.demoSlot.findFirst({ where: { id: slotId, coachingId } });
  if (!slot) throw new Error("Demo slot not found");

  return prisma.demoSlot.update({
    where: { id: slotId },
    data: {
      ...data,
      ...(data.demoDate && { demoDate: new Date(data.demoDate) }),
      ...(data.capacity && { capacity: Number(data.capacity) }),
    },
  });
}

export async function updateDemoSlotStatus(slotId, coachingId, status) {
  const slot = await prisma.demoSlot.findFirst({ where: { id: slotId, coachingId } });
  if (!slot) throw new Error("Demo slot not found");
  return prisma.demoSlot.update({ where: { id: slotId }, data: { status } });
}

export async function listDemoSlots(filters = {}) {
  const demoDateFilter = filters.date
    ? {
        gte: new Date(filters.date),
        lt: new Date(new Date(filters.date).getTime() + 86400000),
      }
    : filters.includePast
      ? undefined
      : { gte: new Date() };

  const where = {
    ...(filters.courseId && { courseId: filters.courseId }),
    ...(filters.coachingId && { coachingId: filters.coachingId }),
    ...(filters.city && { coaching: { city: { contains: filters.city, mode: "insensitive" } } }),
    status: filters.status || { in: ["OPEN", "FULL"] },
    ...(demoDateFilter && { demoDate: demoDateFilter }),
  };

  return prisma.demoSlot.findMany({
    where,
    include: {
      course: { select: { title: true, slug: true } },
      coaching: { select: { name: true, slug: true, city: true } },
    },
    orderBy: { demoDate: "asc" },
  });
}

export async function getDemoSlotById(id) {
  return prisma.demoSlot.findUnique({
    where: { id },
    include: {
      course: true,
      coaching: true,
    },
  });
}

export async function getDemoSlotsByCoachingId(coachingId) {
  return prisma.demoSlot.findMany({
    where: { coachingId },
    include: { course: { select: { title: true } } },
    orderBy: { demoDate: "desc" },
  });
}

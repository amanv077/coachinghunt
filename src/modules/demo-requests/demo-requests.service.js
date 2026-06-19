import { prisma } from "@/lib/db/prisma";
import { createBooking } from "@/modules/bookings/bookings.service";
import { createDemoSlot } from "@/modules/demo-slots/demo-slots.service";
import { computeAvgResponseHours } from "@/modules/coachings/coachings.service";

const requestInclude = {
  student: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
  coaching: { select: { id: true, name: true, slug: true, city: true } },
  course: { select: { id: true, title: true, slug: true } },
  resultingSlot: {
    include: {
      bookings: { select: { id: true, bookingCode: true, status: true } },
    },
  },
};

function addMinutesToTime(time, minutes = 60) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const endHours = Math.floor(total / 60) % 24;
  const endMins = total % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
}

function parseDateOnly(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) throw new Error("Date cannot be in the past");
  return date;
}

async function resolveCourseId(coachingId, courseId) {
  if (courseId) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, coachingId, status: "ACTIVE" },
    });
    if (!course) throw new Error("Invalid course");
    return course.id;
  }

  const fallback = await prisma.course.findFirst({
    where: { coachingId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });
  if (!fallback) throw new Error("No active course found. Create a course first.");
  return fallback.id;
}

async function createSlotAndBook({ coachingId, courseId, studentUserId, demoDate, startTime, topic }) {
  const endTime = addMinutesToTime(startTime, 60);
  const slot = await createDemoSlot(coachingId, {
    courseId,
    topic: topic || "Demo session",
    teacherName: "Faculty",
    demoDate,
    startTime,
    endTime,
    durationMinutes: 60,
    capacity: 1,
  });

  const booking = await createBooking(studentUserId, slot.id);
  return { slot, booking };
}

export async function createDemoRequest(studentUserId, data) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    include: { user: true },
  });
  if (!student) throw new Error("Student profile not found");

  const coaching = await prisma.coachingProfile.findUnique({
    where: { id: data.coachingId },
  });
  if (!coaching) throw new Error("Coaching not found");

  if (data.courseId) {
    const course = await prisma.course.findFirst({
      where: { id: data.courseId, coachingId: data.coachingId },
    });
    if (!course) throw new Error("Invalid course for this coaching");
  }

  const preferredDate = data.preferredDate ? parseDateOnly(data.preferredDate) : null;
  if (!preferredDate) throw new Error("Preferred date is required");

  const existingPending = await prisma.demoRequest.findFirst({
    where: {
      studentId: student.id,
      coachingId: data.coachingId,
      courseId: data.courseId || null,
      status: "PENDING",
    },
  });
  if (existingPending) {
    throw new Error("You already have a pending request for this coaching");
  }

  return prisma.demoRequest.create({
    data: {
      studentId: student.id,
      coachingId: data.coachingId,
      courseId: data.courseId || null,
      preferredDate,
      preferredTime: data.preferredTime || null,
      message: data.message?.trim() || null,
      status: "PENDING",
    },
    include: requestInclude,
  });
}

export async function getStudentDemoRequests(userId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) return [];

  return prisma.demoRequest.findMany({
    where: { studentId: student.id },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoachingDemoRequests(userId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId } });
  if (!coaching) return [];

  return prisma.demoRequest.findMany({
    where: { coachingId: coaching.id },
    include: requestInclude,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPendingDemoRequestCount(userId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) return 0;

  return prisma.demoRequest.count({
    where: { studentId: student.id, status: "PENDING" },
  });
}

export async function getCoachingPendingDemoRequestCount(userId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId } });
  if (!coaching) return 0;

  return prisma.demoRequest.count({
    where: { coachingId: coaching.id, status: "PENDING" },
  });
}

export async function cancelDemoRequest(requestId, studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  const request = await prisma.demoRequest.findFirst({
    where: { id: requestId, studentId: student.id, status: "PENDING" },
  });
  if (!request) throw new Error("Request not found or cannot be cancelled");

  return prisma.demoRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
    include: requestInclude,
  });
}

export async function respondToDemoRequest(requestId, coachingUserId, payload) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const request = await prisma.demoRequest.findFirst({
    where: { id: requestId, coachingId: coaching.id, status: "PENDING" },
    include: {
      student: { include: { user: true } },
      course: true,
    },
  });
  if (!request) throw new Error("Request not found or already handled");

  const { action, date, startTime, responseNote } = payload;

  if (action === "decline") {
    if (!responseNote?.trim()) throw new Error("Please provide a reason for declining");
    const updated = await prisma.demoRequest.update({
      where: { id: requestId },
      data: {
        status: "DECLINED",
        responseNote: responseNote.trim(),
      },
      include: requestInclude,
    });
    await refreshResponseHours(coaching.id);
    return updated;
  }

  if (action !== "approve" && action !== "reschedule") {
    throw new Error("Invalid action");
  }

  if (!date || !startTime) throw new Error("Date and time are required");

  const proposedDate = parseDateOnly(date);
  const courseId = await resolveCourseId(coaching.id, request.courseId);
  const topic = request.course?.title
    ? `Demo: ${request.course.title}`
    : "Demo session (requested)";

  const { slot } = await createSlotAndBook({
    coachingId: coaching.id,
    courseId,
    studentUserId: request.student.user.id,
    demoDate: proposedDate,
    startTime,
    topic,
  });

  const updated = await prisma.demoRequest.update({
    where: { id: requestId },
    data: {
      status: action === "approve" ? "APPROVED" : "RESCHEDULED",
      proposedDate,
      proposedTime: startTime,
      responseNote: responseNote?.trim() || null,
      resultingSlotId: slot.id,
    },
    include: requestInclude,
  });
  await refreshResponseHours(coaching.id);
  return updated;
}

async function refreshResponseHours(coachingId) {
  const avgResponseHours = await computeAvgResponseHours(coachingId);
  await prisma.coachingProfile.update({
    where: { id: coachingId },
    data: { avgResponseHours },
  });
}

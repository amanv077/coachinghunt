import { prisma } from "@/lib/db/prisma";
import { generateBookingCode } from "@/lib/utils/helpers";
import { sendBookingConfirmationEmail, sendCoachingNewBookingEmail, sendCoachingBookingCancelledEmail, sendCoachingBookingRescheduledEmail } from "@/modules/notifications/email.service";
import { writeAuditLog } from "@/lib/audit/log";
import { createDemoRequest } from "@/modules/demo-requests/demo-requests.service";

export async function createBooking(studentUserId, demoSlotId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error("Student profile not found");

  const slot = await prisma.demoSlot.findUnique({
    where: { id: demoSlotId },
    include: { course: true, coaching: true },
  });

  if (!slot) throw new Error("Demo slot not found");
  if (slot.status !== "OPEN") throw new Error("Demo slot is not available");
  if (slot.bookedCount >= slot.capacity) throw new Error("Demo slot is full");

  const existing = await prisma.booking.findUnique({
    where: { studentId_demoSlotId: { studentId: student.id, demoSlotId } },
  });
  if (existing) throw new Error("You already booked this demo slot");

  const bookingCode = generateBookingCode();

  const booking = await prisma.$transaction(async (tx) => {
    const updatedSlot = await tx.demoSlot.updateMany({
      where: { id: demoSlotId, bookedCount: { lt: slot.capacity }, status: "OPEN" },
      data: {
        bookedCount: { increment: 1 },
        status: slot.bookedCount + 1 >= slot.capacity ? "FULL" : "OPEN",
      },
    });

    if (updatedSlot.count === 0) throw new Error("Demo slot is full");

    return tx.booking.create({
      data: {
        studentId: student.id,
        demoSlotId,
        courseId: slot.courseId,
        coachingId: slot.coachingId,
        bookingCode,
        status: "CONFIRMED",
        emailStatus: "PENDING",
      },
      include: {
        demoSlot: true,
        course: true,
        coaching: true,
        student: { include: { user: true } },
      },
    });
  });

  try {
    await sendBookingConfirmationEmail(booking);
    const coachingUser = await prisma.user.findFirst({
      where: { coachingProfile: { id: slot.coachingId } },
      select: { email: true },
    });
    const coachingEmail = booking.coaching.email || coachingUser?.email;
    await sendCoachingNewBookingEmail(booking, coachingEmail);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { emailStatus: "SENT" },
    });
    booking.emailStatus = "SENT";
  } catch (err) {
    console.error("Email failed:", err);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { emailStatus: "FAILED" },
    });
    booking.emailStatus = "FAILED";
  }

  const studentUser = await prisma.user.findUnique({ where: { id: studentUserId } });
  if (studentUser) {
    await writeAuditLog({
      actorUserId: studentUserId,
      actorRole: studentUser.role,
      action: "BOOKING_CREATED",
      entityType: "Booking",
      entityId: booking.id,
      metaJson: { bookingCode: booking.bookingCode },
    });
  }

  return booking;
}

export async function cancelBooking(bookingId, studentUserId, options = {}) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId: student?.id, status: "CONFIRMED" },
    include: {
      demoSlot: true,
      coaching: true,
      student: { include: { user: true } },
    },
  });
  if (!booking) throw new Error("Booking not found");

  const updated = await prisma.$transaction(async (tx) => {
    await tx.demoSlot.update({
      where: { id: booking.demoSlotId },
      data: {
        bookedCount: { decrement: 1 },
        status: "OPEN",
      },
    });
    const result = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    const user = await tx.user.findUnique({ where: { id: studentUserId } });
    if (user) {
      await writeAuditLog({
        actorUserId: studentUserId,
        actorRole: user.role,
        action: "BOOKING_CANCELLED",
        entityType: "Booking",
        entityId: bookingId,
      });
    }

    return result;
  });

  if (!options.skipCoachingEmail) {
    try {
      const coachingUser = await prisma.user.findFirst({
        where: { coachingProfile: { id: booking.coachingId } },
        select: { email: true },
      });
      const coachingEmail = booking.coaching.email || coachingUser?.email;
      await sendCoachingBookingCancelledEmail(booking, coachingEmail, options.reason);
    } catch (err) {
      console.error("Coaching booking cancelled email failed:", err);
    }
  }

  return updated;
}

export async function getStudentBookings(userId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) return [];

  return prisma.booking.findMany({
    where: { studentId: student.id },
    include: {
      demoSlot: true,
      course: true,
      coaching: { select: { name: true, slug: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoachingBookings(userId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId } });
  if (!coaching) return [];

  return prisma.booking.findMany({
    where: { coachingId: coaching.id },
    include: {
      demoSlot: true,
      course: true,
      student: { include: { user: { select: { name: true, email: true, phone: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function rescheduleBooking(bookingId, studentUserId, { preferredDate, preferredTime, message }) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    include: { user: true },
  });
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId: student?.id, status: "CONFIRMED" },
    include: { demoSlot: true, coaching: true, course: true },
  });
  if (!booking) throw new Error("Booking not found");

  if (!preferredDate) throw new Error("Preferred date is required");

  const demoRequest = await createDemoRequest(studentUserId, {
    coachingId: booking.coachingId,
    courseId: booking.courseId,
    preferredDate,
    preferredTime: preferredTime || undefined,
    message: message || "Reschedule requested by student",
    isReschedule: true,
  });

  try {
    await prisma.demoRequest.update({
      where: { id: demoRequest.id },
      data: { rescheduleOf: booking.id },
    });

    await cancelBooking(booking.id, studentUserId, { skipCoachingEmail: true });

    try {
      const coachingUser = await prisma.user.findFirst({
        where: { coachingProfile: { id: booking.coachingId } },
        select: { email: true },
      });
      const coachingEmail = booking.coaching.email || coachingUser?.email;
      await sendCoachingBookingRescheduledEmail({
        coachingEmail,
        coachingName: booking.coaching.name,
        studentName: student.user.name,
        studentEmail: student.user.email,
        oldBookingCode: booking.bookingCode,
        preferredDate,
        preferredTime,
        message,
      });
    } catch (err) {
      console.error("Coaching reschedule email failed:", err);
    }
  } catch (error) {
    await prisma.demoRequest.update({
      where: { id: demoRequest.id },
      data: { status: "CANCELLED" },
    });
    throw error;
  }

  return prisma.demoRequest.findUnique({
    where: { id: demoRequest.id },
    include: {
      coaching: { select: { name: true, slug: true } },
      course: { select: { title: true } },
    },
  });
}

export async function markBookingNoShow(bookingId, coachingUserId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, coachingId: coaching.id, status: { in: ["CONFIRMED", "ATTENDED"] } },
  });
  if (!booking) throw new Error("Booking not found");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "NO_SHOW" },
  });

  await writeAuditLog({
    actorUserId: coachingUserId,
    actorRole: "COACHING",
    action: "BOOKING_NO_SHOW",
    entityType: "Booking",
    entityId: bookingId,
  });

  return updated;
}

export async function markPastBookingsAttended() {
  const now = new Date();
  const result = await prisma.booking.updateMany({
    where: {
      status: "CONFIRMED",
      demoSlot: { demoDate: { lt: now } },
    },
    data: { status: "ATTENDED" },
  });
  return result.count;
}

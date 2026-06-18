import { prisma } from "@/lib/db/prisma";
import { generateBookingCode } from "@/lib/utils/helpers";
import { sendBookingConfirmationEmail } from "@/modules/notifications/email.service";

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

  return booking;
}

export async function cancelBooking(bookingId, studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId: student?.id, status: "CONFIRMED" },
  });
  if (!booking) throw new Error("Booking not found");

  return prisma.$transaction(async (tx) => {
    await tx.demoSlot.update({
      where: { id: booking.demoSlotId },
      data: {
        bookedCount: { decrement: 1 },
        status: "OPEN",
      },
    });
    return tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  });
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

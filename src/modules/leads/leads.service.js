import { prisma } from "@/lib/db/prisma";

export function getPlatformFeeAmount() {
  const amount = Number(process.env.PLATFORM_FEE_AMOUNT);
  if (!amount || amount <= 0) {
    throw new Error("PLATFORM_FEE_AMOUNT must be set to a positive number in environment variables");
  }
  return amount;
}

async function createFeeRecordIfNeeded({ coachingId, demoRequestId, bookingId, enrolledByName }) {
  const amount = getPlatformFeeAmount();
  const existing = await prisma.platformFeeRecord.findFirst({
    where: {
      ...(demoRequestId ? { demoRequestId } : {}),
      ...(bookingId ? { bookingId } : {}),
    },
  });
  if (existing) return existing;

  const feeRecord = await prisma.platformFeeRecord.create({
    data: {
      coachingId,
      demoRequestId: demoRequestId || null,
      bookingId: bookingId || null,
      enrolledByName,
      amount,
      status: "PENDING",
    },
  });

  if (demoRequestId) {
    await prisma.demoRequest.update({
      where: { id: demoRequestId },
      data: { isPaidLead: false },
    });
  }

  return feeRecord;
}

export async function listLeads(coachingUserId, { leadStatus } = {}) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const [requests, bookings] = await Promise.all([
    prisma.demoRequest.findMany({
      where: {
        coachingId: coaching.id,
        ...(leadStatus && { leadStatus }),
      },
      include: {
        student: { include: { user: { select: { name: true, email: true, phone: true } } } },
        course: { select: { title: true, targetExams: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        coachingId: coaching.id,
        ...(leadStatus && { leadStatus }),
      },
      include: {
        student: { include: { user: { select: { name: true, email: true, phone: true } } } },
        course: { select: { title: true, targetExams: true } },
        demoSlot: { select: { demoDate: true, topic: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { requests, bookings };
}

export async function updateLeadStatus(coachingUserId, demoRequestId, { leadStatus, coachingNotes }) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const request = await prisma.demoRequest.findFirst({
    where: { id: demoRequestId, coachingId: coaching.id },
    include: { student: { include: { user: true } } },
  });
  if (!request) throw new Error("Lead not found");

  const updated = await prisma.demoRequest.update({
    where: { id: demoRequestId },
    data: {
      ...(leadStatus && { leadStatus }),
      ...(coachingNotes !== undefined && { coachingNotes }),
    },
  });

  if (leadStatus === "ENROLLED") {
    await createFeeRecordIfNeeded({
      coachingId: coaching.id,
      demoRequestId,
      enrolledByName: request.student.user.name,
    });
  }

  return updated;
}

export async function updateBookingLeadStatus(coachingUserId, bookingId, { leadStatus }) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, coachingId: coaching.id },
    include: { student: { include: { user: true } } },
  });
  if (!booking) throw new Error("Booking lead not found");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { leadStatus },
  });

  if (leadStatus === "ENROLLED") {
    await createFeeRecordIfNeeded({
      coachingId: coaching.id,
      bookingId,
      enrolledByName: booking.student.user.name,
    });
  }

  return updated;
}

export async function listCoachFeeRecords(coachingUserId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  return prisma.platformFeeRecord.findMany({
    where: { coachingId: coaching.id },
    include: {
      demoRequest: {
        select: {
          student: { select: { user: { select: { name: true } } } },
        },
      },
      booking: {
        select: {
          bookingCode: true,
          student: { select: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listFeeRecords({ status } = {}) {
  return prisma.platformFeeRecord.findMany({
    where: status ? { status } : {},
    include: {
      coaching: { select: { name: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFeeRecordStatus(id, status) {
  const feeRecord = await prisma.platformFeeRecord.update({
    where: { id },
    data: { status },
  });

  if (status === "PAID" && feeRecord.demoRequestId) {
    await prisma.demoRequest.update({
      where: { id: feeRecord.demoRequestId },
      data: { isPaidLead: true },
    });
  }

  return feeRecord;
}

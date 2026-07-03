import { prisma } from "@/lib/db/prisma";

const PLATFORM_FEE_AMOUNT = Number(process.env.PLATFORM_FEE_AMOUNT || 0);

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
      where: { coachingId: coaching.id },
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
    const existing = await prisma.platformFeeRecord.findFirst({
      where: { demoRequestId: demoRequestId },
    });
    if (!existing) {
      await prisma.platformFeeRecord.create({
        data: {
          coachingId: coaching.id,
          demoRequestId,
          enrolledByName: request.student.user.name,
          amount: PLATFORM_FEE_AMOUNT,
          status: "PENDING",
        },
      });
    }
  }

  return updated;
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
  return prisma.platformFeeRecord.update({
    where: { id },
    data: { status },
  });
}

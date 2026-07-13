import { prisma } from "@/lib/db/prisma";

export async function createContentReport(reporterUserId, data) {
  if (!data.reviewId && !data.qaId) {
    throw new Error("Review or Q&A item is required");
  }
  if (!data.reason?.trim()) {
    throw new Error("Reason is required");
  }

  const existing = await prisma.contentReport.findFirst({
    where: {
      reporterUserId,
      status: "PENDING",
      ...(data.reviewId ? { reviewId: data.reviewId } : {}),
      ...(data.qaId ? { qaId: data.qaId } : {}),
    },
  });
  if (existing) {
    throw new Error("You already reported this content");
  }

  return prisma.contentReport.create({
    data: {
      reporterUserId,
      coachingId: data.coachingId || null,
      reviewId: data.reviewId || null,
      qaId: data.qaId || null,
      reason: data.reason.trim(),
    },
  });
}

export async function listContentReports({ status = "PENDING" } = {}) {
  return prisma.contentReport.findMany({
    where: { status },
    include: {
      reporter: { select: { name: true, email: true } },
      coaching: { select: { name: true, slug: true } },
      review: {
        include: { student: { include: { user: { select: { name: true } } } } },
      },
      qa: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateContentReportStatus(id, { status, adminNote }) {
  const validStatuses = ["RESOLVED", "DISMISSED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  return prisma.contentReport.update({
    where: { id },
    data: {
      status,
      adminNote: adminNote?.trim() || null,
    },
  });
}

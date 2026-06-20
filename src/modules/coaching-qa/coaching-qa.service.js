import { prisma } from "@/lib/db/prisma";

export async function listQA(coachingId, { includePending = false } = {}) {
  return prisma.coachingQA.findMany({
    where: {
      coachingId,
      ...(includePending
        ? {}
        : { status: "ANSWERED", isPublic: true }),
    },
    include: {
      askedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function askQuestion(userId, coachingId, question) {
  const coaching = await prisma.coachingProfile.findFirst({
    where: { id: coachingId, listingStatus: "ACTIVE" },
  });
  if (!coaching) throw new Error("Coaching not found");
  if (!question?.trim()) throw new Error("Question is required");

  return prisma.coachingQA.create({
    data: {
      coachingId,
      askedByUserId: userId,
      question: question.trim(),
      status: "PENDING",
    },
  });
}

export async function answerQuestion(coachingUserId, qaId, answer) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const qa = await prisma.coachingQA.findFirst({
    where: { id: qaId, coachingId: coaching.id },
  });
  if (!qa) throw new Error("Question not found");
  if (!answer?.trim()) throw new Error("Answer is required");

  return prisma.coachingQA.update({
    where: { id: qaId },
    data: {
      answer: answer.trim(),
      status: "ANSWERED",
      answeredAt: new Date(),
    },
    include: { askedBy: { select: { name: true } } },
  });
}

export async function moderateQA(qaId, { status, isPublic }) {
  return prisma.coachingQA.update({
    where: { id: qaId },
    data: {
      ...(status && { status }),
      ...(typeof isPublic === "boolean" && { isPublic }),
    },
  });
}

export async function getPendingQACount(coachingId) {
  return prisma.coachingQA.count({
    where: { coachingId, status: "PENDING" },
  });
}

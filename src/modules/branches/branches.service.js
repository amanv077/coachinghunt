import { prisma } from "@/lib/db/prisma";

export async function listBranches(coachingUserId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  return prisma.coachingBranch.findMany({
    where: { coachingId: coaching.id },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
}

export async function createBranch(coachingUserId, data) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  if (data.isPrimary) {
    await prisma.coachingBranch.updateMany({
      where: { coachingId: coaching.id },
      data: { isPrimary: false },
    });
  }

  return prisma.coachingBranch.create({
    data: {
      coachingId: coaching.id,
      branchName: data.branchName,
      city: data.city || null,
      locality: data.locality || null,
      address: data.address || null,
      phone: data.phone || null,
      isPrimary: !!data.isPrimary,
    },
  });
}

export async function updateBranch(coachingUserId, branchId, data) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const branch = await prisma.coachingBranch.findFirst({
    where: { id: branchId, coachingId: coaching.id },
  });
  if (!branch) throw new Error("Branch not found");

  if (data.isPrimary) {
    await prisma.coachingBranch.updateMany({
      where: { coachingId: coaching.id },
      data: { isPrimary: false },
    });
  }

  return prisma.coachingBranch.update({
    where: { id: branchId },
    data: {
      branchName: data.branchName ?? branch.branchName,
      city: data.city ?? branch.city,
      locality: data.locality ?? branch.locality,
      address: data.address ?? branch.address,
      phone: data.phone ?? branch.phone,
      isPrimary: data.isPrimary ?? branch.isPrimary,
    },
  });
}

export async function deleteBranch(coachingUserId, branchId) {
  const coaching = await prisma.coachingProfile.findUnique({ where: { userId: coachingUserId } });
  if (!coaching) throw new Error("Coaching profile not found");

  const branch = await prisma.coachingBranch.findFirst({
    where: { id: branchId, coachingId: coaching.id },
  });
  if (!branch) throw new Error("Branch not found");

  return prisma.coachingBranch.delete({ where: { id: branchId } });
}

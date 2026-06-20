import { prisma } from "@/lib/db/prisma";

export async function writeAuditLog({ actorUserId, actorRole, action, entityType, entityId, metaJson }) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId,
        actorRole,
        action,
        entityType,
        entityId,
        metaJson: metaJson || undefined,
      },
    });
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}

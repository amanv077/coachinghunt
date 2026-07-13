import { prisma } from "@/lib/db/prisma";
import {
  sendCoachingDemoRequestReminderEmail,
  sendStudentDemoRequestExpiredEmail,
} from "@/modules/notifications/email.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return errorResponse("Cron not configured", [], 503);
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return errorResponse("Unauthorized", [], 401);
  }

  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const staleRequests = await prisma.demoRequest.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: fiveDaysAgo },
    },
    include: {
      student: { include: { user: true } },
      coaching: { select: { id: true, name: true, email: true } },
    },
  });

  let expired = 0;
  for (const request of staleRequests) {
    try {
      await prisma.demoRequest.update({
        where: { id: request.id },
        data: { status: "CANCELLED" },
      });
      await sendStudentDemoRequestExpiredEmail({
        ...request,
        status: "CANCELLED",
      });
      expired++;
    } catch (error) {
      console.error("Expire demo request failed", request.id, error);
    }
  }

  const reminderCandidates = await prisma.demoRequest.findMany({
    where: {
      status: "PENDING",
      slaReminderSent: false,
      createdAt: { lte: oneDayAgo },
    },
    include: {
      coaching: { select: { id: true, name: true, email: true } },
    },
  });

  const coachingPendingCounts = new Map();
  for (const request of reminderCandidates) {
    coachingPendingCounts.set(
      request.coachingId,
      (coachingPendingCounts.get(request.coachingId) || 0) + 1
    );
  }

  let remindersSent = 0;
  for (const [coachingId, count] of coachingPendingCounts) {
    const coaching = reminderCandidates.find((r) => r.coachingId === coachingId)?.coaching;
    if (!coaching) continue;

    try {
      const coachingUser = await prisma.user.findFirst({
        where: { coachingProfile: { id: coachingId } },
        select: { email: true },
      });
      const coachingEmail = coaching.email || coachingUser?.email;
      await sendCoachingDemoRequestReminderEmail(coachingEmail, coaching.name, count);

      await prisma.demoRequest.updateMany({
        where: {
          coachingId,
          status: "PENDING",
          slaReminderSent: false,
          createdAt: { lte: oneDayAgo },
        },
        data: { slaReminderSent: true },
      });
      remindersSent++;
    } catch (error) {
      console.error("Demo request SLA reminder failed", coachingId, error);
    }
  }

  return successResponse({
    expired,
    remindersSent,
    staleProcessed: staleRequests.length,
    reminderCandidates: reminderCandidates.length,
  });
}

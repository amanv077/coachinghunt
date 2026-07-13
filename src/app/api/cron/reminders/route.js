import { prisma } from "@/lib/db/prisma";
import { sendBookingReminderEmail } from "@/modules/notifications/email.service";
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
  const windowStart = new Date(now.getTime() + 22 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSent: false,
      demoSlot: {
        demoDate: { gte: windowStart, lte: windowEnd },
      },
    },
    include: {
      demoSlot: true,
      coaching: true,
      course: true,
      student: { include: { user: true } },
    },
  });

  let sent = 0;
  for (const booking of bookings) {
    try {
      await sendBookingReminderEmail(booking);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent: true },
      });
      sent++;
    } catch (error) {
      console.error("Reminder failed for booking", booking.id, error);
    }
  }

  return successResponse({ processed: bookings.length, sent });
}

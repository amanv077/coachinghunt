import { sendEmail } from "@/lib/email/mailer";
import { bookingConfirmationTemplate, bookingReminderTemplate, reviewInviteTemplate } from "./email.templates";

export async function sendBookingConfirmationEmail(booking) {
  const html = bookingConfirmationTemplate(booking);
  await sendEmail({
    to: booking.student.user.email,
    subject: `Demo Booking Confirmed - ${booking.bookingCode}`,
    html,
  });
}

export async function sendBookingReminderEmail(booking) {
  const html = bookingReminderTemplate(booking);
  await sendEmail({
    to: booking.student.user.email,
    subject: `Reminder: Demo tomorrow at ${booking.coaching.name}`,
    html,
  });
}

export async function sendReviewInviteEmail({ studentEmail, studentName, coachingName, coachingSlug }) {
  const html = reviewInviteTemplate({ studentName, coachingName, coachingSlug });
  await sendEmail({
    to: studentEmail,
    subject: `How was your demo at ${coachingName}?`,
    html,
  });
}

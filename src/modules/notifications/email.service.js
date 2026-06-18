import { sendEmail } from "@/lib/email/mailer";
import { bookingConfirmationTemplate } from "./email.templates";

export async function sendBookingConfirmationEmail(booking) {
  const html = bookingConfirmationTemplate(booking);
  await sendEmail({
    to: booking.student.user.email,
    subject: `Demo Booking Confirmed - ${booking.bookingCode}`,
    html,
  });
}

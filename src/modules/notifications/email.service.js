import { sendEmail } from "@/lib/email/mailer";
import {
  bookingConfirmationTemplate,
  bookingReminderTemplate,
  reviewInviteTemplate,
  coachingDemoRequestTemplate,
  coachingNewBookingTemplate,
} from "./email.templates";

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

export async function sendCoachingDemoRequestEmail(demoRequest, coachingEmail) {
  if (!coachingEmail) return;
  const html = coachingDemoRequestTemplate({
    coachingName: demoRequest.coaching.name,
    studentName: demoRequest.student.user.name,
    studentEmail: demoRequest.student.user.email,
    studentPhone: demoRequest.student.user.phone,
    preferredDate: demoRequest.preferredDate,
    preferredTime: demoRequest.preferredTime,
    message: demoRequest.message,
    courseTitle: demoRequest.course?.title,
  });
  await sendEmail({
    to: coachingEmail,
    subject: `New demo request from ${demoRequest.student.user.name}`,
    html,
  });
}

export async function sendCoachingNewBookingEmail(booking, coachingEmail) {
  if (!coachingEmail) return;
  const slot = booking.demoSlot;
  const html = coachingNewBookingTemplate({
    coachingName: booking.coaching.name,
    studentName: booking.student.user.name,
    studentEmail: booking.student.user.email,
    studentPhone: booking.student.user.phone,
    bookingCode: booking.bookingCode,
    topic: slot.topic,
    demoDate: slot.demoDate,
    startTime: slot.startTime,
    endTime: slot.endTime,
  });
  await sendEmail({
    to: coachingEmail,
    subject: `New booking: ${booking.bookingCode}`,
    html,
  });
}

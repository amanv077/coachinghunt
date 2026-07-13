export function bookingConfirmationTemplate(booking) {
  const appName = process.env.APP_NAME || "CoachingHunt";
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const slot = booking.demoSlot;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C4C9C;">Demo Booking Confirmed!</h2>
      <p>Hi ${booking.student.user.name},</p>
      <p>Your demo session booking has been confirmed on ${appName}.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Booking Code:</strong> ${booking.bookingCode}</p>
        <p><strong>Coaching:</strong> ${booking.coaching.name}</p>
        <p><strong>Course:</strong> ${booking.course.title}</p>
        <p><strong>Topic:</strong> ${slot.topic}</p>
        <p><strong>Teacher:</strong> ${slot.teacherName}</p>
        <p><strong>Date:</strong> ${new Date(slot.demoDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</p>
        <p><strong>Venue:</strong> ${slot.venueName || "TBA"}</p>
        ${slot.venueAddress ? `<p><strong>Address:</strong> ${slot.venueAddress}</p>` : ""}
        ${slot.joiningLink ? `<p><strong>Join link:</strong> <a href="${slot.joiningLink}">${slot.joiningLink}</a></p>` : ""}
        ${slot.instructions ? `<p><strong>Instructions:</strong> ${slot.instructions}</p>` : ""}
      </div>
      <p><a href="${appUrl}/student/bookings" style="color: #2C4C9C;">View your bookings</a></p>
      <p>Thank you for using ${appName}!</p>
    </div>
  `;
}

export function bookingReminderTemplate(booking) {
  const appName = process.env.APP_NAME || "CoachingHunt";
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const slot = booking.demoSlot;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C4C9C;">Reminder: Demo tomorrow</h2>
      <p>Hi ${booking.student.user.name},</p>
      <p>This is a friendly reminder about your upcoming demo session on ${appName}.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Booking Code:</strong> ${booking.bookingCode}</p>
        <p><strong>Coaching:</strong> ${booking.coaching.name}</p>
        <p><strong>Date:</strong> ${new Date(slot.demoDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</p>
        ${slot.joiningLink ? `<p><strong>Join link:</strong> <a href="${slot.joiningLink}">${slot.joiningLink}</a></p>` : ""}
      </div>
      <p><a href="${appUrl}/student/bookings" style="color: #2C4C9C;">View your bookings</a></p>
    </div>
  `;
}

export function reviewInviteTemplate({ studentName, coachingName, coachingSlug }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C4C9C;">Share your experience</h2>
      <p>Hi ${studentName},</p>
      <p>We hope you enjoyed your demo at <strong>${coachingName}</strong>.</p>
      <p>Your review helps other students choose the right coaching.</p>
      <p><a href="${appUrl}/coaching/${coachingSlug}#reviews" style="color: #2C4C9C;">Leave a review</a></p>
    </div>
  `;
}

export function coachingDemoRequestTemplate({ coachingName, studentName, studentEmail, studentPhone, preferredDate, preferredTime, message, courseTitle }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C4C9C;">New demo request</h2>
      <p>A student requested a demo for <strong>${coachingName}</strong>.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${studentEmail}</p>
        ${studentPhone ? `<p><strong>Phone:</strong> ${studentPhone}</p>` : ""}
        ${courseTitle ? `<p><strong>Course:</strong> ${courseTitle}</p>` : ""}
        <p><strong>Preferred date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
        ${preferredTime ? `<p><strong>Preferred time:</strong> ${preferredTime}</p>` : ""}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      </div>
      <p><a href="${appUrl}/coaching/bookings" style="color: #2C4C9C;">Respond in your dashboard</a></p>
    </div>
  `;
}

export function coachingNewBookingTemplate({ coachingName, studentName, studentEmail, studentPhone, bookingCode, topic, demoDate, startTime, endTime }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C4C9C;">New demo booking</h2>
      <p>A student booked a demo for <strong>${coachingName}</strong>.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Booking code:</strong> ${bookingCode}</p>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${studentEmail}</p>
        ${studentPhone ? `<p><strong>Phone:</strong> ${studentPhone}</p>` : ""}
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Date:</strong> ${new Date(demoDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
      </div>
      <p><a href="${appUrl}/coaching/bookings" style="color: #2C4C9C;">View bookings</a></p>
    </div>
  `;
}

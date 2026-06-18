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
        ${slot.instructions ? `<p><strong>Instructions:</strong> ${slot.instructions}</p>` : ""}
      </div>
      <p><a href="${appUrl}/student/bookings" style="color: #2C4C9C;">View your bookings</a></p>
      <p>Thank you for using ${appName}!</p>
    </div>
  `;
}

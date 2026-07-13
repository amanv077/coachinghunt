import { z } from "zod";
import { sendEmail } from "@/lib/email/mailer";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/utils/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(request) {
  const limited = rateLimit(request, "contact", 5, 15 * 60 * 1000);
  if (limited) return errorResponse("Too many messages. Try again later.", [], 429);

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", parsed.error.errors, 422);
    }

    const { name, email, message } = parsed.data;
    const supportEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

    if (!supportEmail) {
      return errorResponse("Contact form is temporarily unavailable", [], 503);
    }

    await sendEmail({
      to: supportEmail,
      subject: `[CoachingHunt Contact] Message from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return successResponse(null, "Message sent successfully");
  } catch (error) {
    console.error("Contact form error:", error);
    return errorResponse("Failed to send message. Please try again later.", [], 500);
  }
}

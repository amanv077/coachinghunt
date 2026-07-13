import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requestPasswordReset } from "@/modules/auth/password.service";
import { rateLimit } from "@/lib/utils/rate-limit";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request) {
  const limited = rateLimit(request, "forgot-password", 5, 15 * 60 * 1000);
  if (limited) return errorResponse("Too many requests. Try again later.", [], 429);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return errorResponse("Valid email required", [], 400);

    await requestPasswordReset(parsed.data.email);
    return successResponse(null, "If an account exists, a reset link has been sent.");
  } catch (error) {
    return errorResponse(error.message || "Failed to process request", [], 500);
  }
}

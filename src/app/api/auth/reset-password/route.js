import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { resetPassword } from "@/modules/auth/password.service";
import { rateLimit } from "@/lib/utils/rate-limit";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(request) {
  const limited = rateLimit(request, "reset-password", 10, 15 * 60 * 1000);
  if (limited) return errorResponse("Too many requests. Try again later.", [], 429);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid reset data", [], 400);

    await resetPassword(parsed.data);
    return successResponse(null, "Password updated. You can sign in now.");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

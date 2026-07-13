import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { changePassword } from "@/modules/auth/password.service";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function POST(request) {
  const auth = await requireAuth();
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid password data", [], 400);

    await changePassword(auth.session.user.id, parsed.data);
    return successResponse(null, "Password updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

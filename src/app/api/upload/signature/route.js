import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getUploadSignature } from "@/lib/cloudinary/cloudinary";

export async function POST() {
  const auth = await requireAuth(["COACHING", "STUDENT", "ADMIN"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  const signature = getUploadSignature("coachinghunt");
  return successResponse(signature);
}

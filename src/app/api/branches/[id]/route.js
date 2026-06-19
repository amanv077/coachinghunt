import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { updateBranch, deleteBranch } from "@/modules/branches/branches.service";

export async function PATCH(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const branch = await updateBranch(auth.session.user.id, id, body);
    return successResponse(branch, "Branch updated");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const { id } = await params;
    await deleteBranch(auth.session.user.id, id);
    return successResponse(null, "Branch deleted");
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

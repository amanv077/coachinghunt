import { requireAuth } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { listBranches, createBranch } from "@/modules/branches/branches.service";

export async function GET() {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const branches = await listBranches(auth.session.user.id);
    return successResponse(branches);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function POST(request) {
  const auth = await requireAuth(["COACHING"]);
  if (auth.error) return errorResponse(auth.error, [], auth.status);

  try {
    const body = await request.json();
    if (!body.branchName?.trim()) return errorResponse("Branch name is required", [], 400);
    const branch = await createBranch(auth.session.user.id, body);
    return successResponse(branch, "Branch created", 201);
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

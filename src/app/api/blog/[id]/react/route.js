import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/auth/session";
import {
  togglePostReaction,
  getPostReactionState,
  getPostReactionCounts,
} from "@/modules/blog/blog.service";

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userId = session?.user?.id || null;
    const ipAddress = getClientIp(request);

    const reactionState = await getPostReactionState({
      blogPostId: id,
      userId,
      ipAddress,
    });
    const counts = await getPostReactionCounts(id);

    return successResponse({
      activeReaction: reactionState,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (type !== "LIKE" && type !== "DISLIKE") {
      return errorResponse("Invalid reaction type", [], 400);
    }

    const session = await getSession();
    const userId = session?.user?.id || null;
    const ipAddress = getClientIp(request);

    const result = await togglePostReaction({
      blogPostId: id,
      userId,
      ipAddress,
      type,
    });

    const counts = await getPostReactionCounts(id);
    const newReactionState = await getPostReactionState({
      blogPostId: id,
      userId,
      ipAddress,
    });

    return successResponse({
      action: result.action,
      activeReaction: newReactionState,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    return errorResponse(error.message, [], 400);
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth(roles = []) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthenticated", status: 401 };
  }
  if (roles.length && !roles.includes(session.user.role)) {
    return { error: "Forbidden", status: 403 };
  }
  return { session };
}

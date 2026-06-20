import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudentDashboardShell } from "@/components/dashboard/StudentDashboardShell";
import { getDashboardPath } from "@/lib/auth/dashboard";
import { getLoginHref } from "@/lib/auth/login";
import { getSession } from "@/lib/auth/session";

export default async function StudentLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/student/dashboard";
    redirect(getLoginHref(pathname));
  }

  if (session.user.role !== "STUDENT") {
    redirect(getDashboardPath(session.user.role) || "/");
  }

  return <StudentDashboardShell>{children}</StudentDashboardShell>;
}

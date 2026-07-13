import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardPath } from "@/lib/auth/dashboard";
import { getLoginHref } from "@/lib/auth/login";
import { getSession } from "@/lib/auth/session";

const items = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/qa", label: "Q&A" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/blog-queries", label: "Blog Queries" },
  { href: "/admin/fee-records", label: "Fee Records" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
];

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/admin/dashboard";
    redirect(getLoginHref(pathname));
  }

  if (session.user.role !== "ADMIN") {
    redirect(getDashboardPath(session.user.role) || "/");
  }

  return (
    <DashboardShell items={items} title="Admin">
      {children}
    </DashboardShell>
  );
}

import { DashboardShell } from "@/components/dashboard/DashboardShell";

const items = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/qa", label: "Q&A" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/fee-records", label: "Fee Records" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardShell items={items} title="Admin">
      {children}
    </DashboardShell>
  );
}

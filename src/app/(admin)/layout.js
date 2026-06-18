import { DashboardShell } from "@/components/dashboard/DashboardShell";

const items = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardShell items={items} title="Admin">
      {children}
    </DashboardShell>
  );
}

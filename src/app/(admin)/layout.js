import { Navbar } from "@/components/shared/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const items = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} title="Admin" />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

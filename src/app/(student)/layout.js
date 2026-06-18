import { Navbar } from "@/components/shared/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const items = [
  { href: "/student/dashboard", label: "Overview" },
  { href: "/student/bookings", label: "My Bookings" },
  { href: "/student/offers", label: "Offers" },
  { href: "/student/profile", label: "Profile" },
];

export default function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} title="Student" />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

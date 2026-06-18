import { Navbar } from "@/components/shared/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const items = [
  { href: "/coaching/dashboard", label: "Overview" },
  { href: "/coaching/profile", label: "Profile" },
  { href: "/coaching/courses", label: "Courses" },
  { href: "/coaching/demo-slots", label: "Demo Slots" },
  { href: "/coaching/bookings", label: "Bookings" },
  { href: "/coaching/offers", label: "Offers" },
];

export default function CoachingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} title="Coaching" />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

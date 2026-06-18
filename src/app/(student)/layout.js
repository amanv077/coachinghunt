import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  OverviewIcon,
  BookingsIcon,
  OffersIcon,
  ProfileIcon,
} from "@/components/dashboard/student-nav-icons";

const items = [
  { href: "/student/dashboard", label: "Overview", icon: <OverviewIcon /> },
  { href: "/student/bookings", label: "My Bookings", icon: <BookingsIcon /> },
  { href: "/student/offers", label: "Offers", icon: <OffersIcon /> },
  { href: "/student/profile", label: "Profile", icon: <ProfileIcon /> },
];

export default function StudentLayout({ children }) {
  return (
    <DashboardShell items={items} title="Student">
      {children}
    </DashboardShell>
  );
}

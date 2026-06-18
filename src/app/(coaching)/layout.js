import { DashboardShell } from "@/components/dashboard/DashboardShell";

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
    <DashboardShell items={items} title="Coaching">
      {children}
    </DashboardShell>
  );
}

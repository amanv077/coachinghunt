import { DashboardShell } from "@/components/dashboard/DashboardShell";

const items = [
  { href: "/coaching/dashboard", label: "Overview" },
  { href: "/coaching/profile", label: "Profile" },
  { href: "/coaching/branches", label: "Branches" },
  { href: "/coaching/courses", label: "Courses" },
  { href: "/coaching/demo-slots", label: "Demo Slots" },
  { href: "/coaching/bookings", label: "Bookings" },
  { href: "/coaching/leads", label: "Leads" },
  { href: "/coaching/qa", label: "Q&A" },
  { href: "/coaching/analytics", label: "Analytics" },
  { href: "/coaching/offers", label: "Offers" },
];

export default function CoachingLayout({ children }) {
  return (
    <DashboardShell items={items} title="Coaching">
      {children}
    </DashboardShell>
  );
}

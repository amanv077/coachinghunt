import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  DashboardIcon,
  ProfileIcon,
  BranchesIcon,
  CoursesIcon,
  DemoSlotsIcon,
  BookingsIcon,
  LeadsIcon,
  QAIcon,
  AnalyticsIcon,
  OffersIcon,
} from "@/components/dashboard/coaching-nav-icons";

const items = [
  { href: "/coaching/dashboard", label: "Overview", icon: <DashboardIcon /> },
  { href: "/coaching/profile", label: "Profile", icon: <ProfileIcon /> },
  { href: "/coaching/branches", label: "Branches", icon: <BranchesIcon /> },
  { href: "/coaching/courses", label: "Courses", icon: <CoursesIcon /> },
  { href: "/coaching/demo-slots", label: "Demo Slots", icon: <DemoSlotsIcon /> },
  { href: "/coaching/bookings", label: "Bookings", icon: <BookingsIcon /> },
  { href: "/coaching/leads", label: "Leads", icon: <LeadsIcon /> },
  { href: "/coaching/qa", label: "Q&A", icon: <QAIcon /> },
  { href: "/coaching/analytics", label: "Analytics", icon: <AnalyticsIcon /> },
  { href: "/coaching/offers", label: "Offers", icon: <OffersIcon /> },
];

export default function CoachingLayout({ children }) {
  return (
    <DashboardShell items={items} title="Coaching">
      {children}
    </DashboardShell>
  );
}

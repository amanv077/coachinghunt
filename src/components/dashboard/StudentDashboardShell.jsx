"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useCompare } from "@/components/shared/CompareContext";
import {
  OverviewIcon,
  BookingsIcon,
  OffersIcon,
  ProfileIcon,
  SearchIcon,
  SavedIcon,
  CompareIcon,
} from "@/components/dashboard/student-nav-icons";

export function StudentDashboardShell({ children }) {
  const { compareList } = useCompare();

  const compareHref =
    compareList.length >= 2
      ? `/compare?ids=${compareList.map((item) => item.id).join(",")}`
      : "/compare";

  const items = [
    { href: "/student/dashboard", label: "Overview", icon: <OverviewIcon /> },
    { href: "/search", label: "Find Coachings", icon: <SearchIcon /> },
    { href: "/student/saved", label: "Saved", icon: <SavedIcon /> },
    {
      href: compareHref,
      label: "Compare",
      icon: <CompareIcon />,
      highlight: true,
      badge: compareList.length > 0 ? String(compareList.length) : null,
    },
    { href: "/student/bookings", label: "My Bookings", icon: <BookingsIcon /> },
    { href: "/student/offers", label: "Offers", icon: <OffersIcon /> },
    { href: "/student/profile", label: "Profile", icon: <ProfileIcon /> },
  ];

  return (
    <DashboardShell items={items} title="Student">
      {children}
    </DashboardShell>
  );
}

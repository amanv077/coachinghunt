import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
  BillingIcon,
} from "@/components/dashboard/coaching-nav-icons";
import { getDashboardPath } from "@/lib/auth/dashboard";
import { getLoginHref } from "@/lib/auth/login";
import { getSession } from "@/lib/auth/session";

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
  { href: "/coaching/billing", label: "Billing", icon: <BillingIcon /> },
];

export default async function CoachingLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/coaching/dashboard";
    redirect(getLoginHref(pathname));
  }

  if (session.user.role !== "COACHING") {
    redirect(getDashboardPath(session.user.role) || "/");
  }

  return (
    <DashboardShell items={items} title="Coaching">
      {children}
    </DashboardShell>
  );
}

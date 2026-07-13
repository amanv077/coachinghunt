export const publicGuestLinks = [
  { href: "/search", label: "Find Coachings" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export const publicStudentLinks = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/search", label: "Find Coachings" },
  { href: "/compare", label: "Compare" },
  { href: "/student/bookings", label: "My Bookings" },
  { href: "/student/offers", label: "Offers" },
];

export const publicCoachingLinks = [
  { href: "/coaching/dashboard", label: "Dashboard" },
  { href: "/coaching/demo-slots", label: "Demo Slots" },
  { href: "/coaching/bookings", label: "Bookings" },
];

export const publicAdminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/coachings", label: "Coachings" },
  { href: "/admin/bookings", label: "Bookings" },
];

export const variantMeta = {
  public: { label: null, homePath: "/", showBadge: false },
  student: { label: "Student", homePath: "/student/dashboard", showBadge: false },
  coaching: { label: "Coaching", homePath: "/coaching/dashboard", showBadge: true },
  admin: { label: "Admin", homePath: "/admin/dashboard", showBadge: true },
};

export function getPublicNavLinks(role) {
  if (role === "STUDENT") return publicStudentLinks;
  if (role === "COACHING") return publicCoachingLinks;
  if (role === "ADMIN") return publicAdminLinks;
  return publicGuestLinks;
}

export function getQuickAction(variant, role) {
  if (variant === "coaching" || role === "COACHING") {
    return { href: "/coaching/demo-slots", label: "Add Demo Slot" };
  }
  return null;
}

export function isNavLinkActive(pathname, href) {
  const baseHref = href.split("?")[0];
  if (baseHref === "/compare") {
    return pathname === "/compare";
  }
  if (baseHref === "/coaching/dashboard" || baseHref === "/admin/dashboard" || baseHref === "/student/dashboard") {
    return pathname === baseHref;
  }
  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

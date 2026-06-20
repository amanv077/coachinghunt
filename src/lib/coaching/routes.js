/** Coaching institute dashboard paths (auth required). Public profiles live at /coaching/[slug]. */
export const COACHING_DASHBOARD_ROUTES = [
  "/coaching/dashboard",
  "/coaching/profile",
  "/coaching/branches",
  "/coaching/courses",
  "/coaching/demo-slots",
  "/coaching/bookings",
  "/coaching/offers",
  "/coaching/qa",
  "/coaching/leads",
  "/coaching/analytics",
];

export function isCoachingDashboardRoute(pathname) {
  return COACHING_DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

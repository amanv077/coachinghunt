import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isCoachingDashboardRoute } from "@/lib/coaching/routes";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isCoachingDashboardRoute(pathname) && role !== "COACHING") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/student") || pathname.startsWith("/admin")) {
          return !!token;
        }
        if (isCoachingDashboardRoute(pathname)) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/student/:path*",
    "/coaching/dashboard/:path*",
    "/coaching/profile/:path*",
    "/coaching/courses/:path*",
    "/coaching/demo-slots/:path*",
    "/coaching/bookings/:path*",
    "/coaching/offers/:path*",
    "/admin/:path*",
  ],
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getDashboardPath } from "@/lib/auth/dashboard";
import { getLoginHref } from "@/lib/auth/login";
import { isCoachingDashboardRoute } from "@/lib/coaching/routes";

function nextWithPathname(req, pathname) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname === "/") {
      const dashboardPath = getDashboardPath(role);
      if (dashboardPath) {
        return NextResponse.redirect(new URL(dashboardPath, req.url));
      }
      return nextWithPathname(req, pathname);
    }

    // Student routes use server layout auth — Edge middleware often misses JWT cookies on Vercel.
    if (pathname.startsWith("/student")) {
      return nextWithPathname(req, pathname);
    }

    if (isCoachingDashboardRoute(pathname) && role !== "COACHING") {
      const loginUrl = new URL(getLoginHref(pathname), req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const loginUrl = new URL(getLoginHref(pathname), req.url);
      return NextResponse.redirect(loginUrl);
    }

    return nextWithPathname(req, pathname);
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname === "/") {
          return true;
        }
        if (pathname.startsWith("/student")) {
          return true;
        }
        if (pathname.startsWith("/admin")) {
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
    "/",
    "/student/:path*",
    "/coaching/dashboard/:path*",
    "/coaching/profile/:path*",
    "/coaching/branches/:path*",
    "/coaching/courses/:path*",
    "/coaching/demo-slots/:path*",
    "/coaching/bookings/:path*",
    "/coaching/offers/:path*",
    "/coaching/qa/:path*",
    "/coaching/leads/:path*",
    "/coaching/analytics/:path*",
    "/coaching/billing/:path*",
    "/admin/:path*",
  ],
};

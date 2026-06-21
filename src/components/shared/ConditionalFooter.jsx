"use client";

import { useSession } from "next-auth/react";
import { Footer } from "@/components/shared/Footer";

const DASHBOARD_ROLES = new Set(["STUDENT", "COACHING", "ADMIN"]);

export function ConditionalFooter() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  if (status === "loading") {
    return null;
  }

  if (role && DASHBOARD_ROLES.has(role)) {
    return null;
  }

  return <Footer />;
}

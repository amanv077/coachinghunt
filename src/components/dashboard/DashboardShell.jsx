"use client";

import { Navbar } from "@/components/shared/Navbar";
import { variantMeta } from "@/components/shared/nav-config";
import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const variantByTitle = {
  Student: "student",
  Coaching: "coaching",
  Admin: "admin",
};

export function DashboardShell({ items, title, children }) {
  const variant = variantByTitle[title] ?? "student";
  const meta = variantMeta[variant] ?? variantMeta.student;
  const useMobileDrawer = items.length > 5;

  return (
    <div className="dashboard-layout flex min-h-dvh w-full flex-col bg-white md:fixed md:inset-0 md:h-dvh md:max-h-dvh md:flex-row md:overflow-hidden">
      <DashboardSidebar
        items={items}
        title={title}
        variant={variant}
        homeHref={meta.homePath}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          variant={variant}
          sidebarItems={useMobileDrawer ? items : []}
          hideLogoOnDesktop
        />
        <DashboardMobileNav items={items} showMobileTabs={!useMobileDrawer} />

        <main className="dashboard-scroll min-h-0 min-w-0 flex-1 overflow-x-clip bg-surface-muted pb-28 md:overflow-y-auto md:pb-6">
          <div className="dashboard-content mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

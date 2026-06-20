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
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={items}
        title={title}
        variant={variant}
        homeHref={meta.homePath}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          variant={variant}
          sidebarItems={useMobileDrawer ? items : []}
          hideLogoOnDesktop
        />
        <DashboardMobileNav items={items} showMobileTabs={!useMobileDrawer} />
        <main className="min-w-0 flex-1 bg-surface-muted pb-28 md:pb-6">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

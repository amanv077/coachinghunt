import { Navbar } from "@/components/shared/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const variantByTitle = {
  Student: "student",
  Coaching: "coaching",
  Admin: "admin",
};

export function DashboardShell({ items, title, children }) {
  const variant = variantByTitle[title] ?? "student";
  const useMobileDrawer = items.length > 5;

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <Navbar variant={variant} sidebarItems={useMobileDrawer ? items : []} />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} title={title} showMobileTabs={!useMobileDrawer} />
        <main className="min-w-0 flex-1 bg-white pb-28 md:pb-6">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

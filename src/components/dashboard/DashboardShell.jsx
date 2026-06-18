import { Navbar } from "@/components/shared/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export function DashboardShell({ items, title, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} title={title} />
        <main className="min-w-0 flex-1 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

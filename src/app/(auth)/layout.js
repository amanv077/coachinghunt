import { BrandPanel } from "@/components/shared/BrandPanel";
import { AuthHeader } from "@/components/shared/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-surface-muted">
      {/* Brand panel — desktop only */}
      <BrandPanel />

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md md:max-w-lg">
          <AuthHeader />
          <main className="mt-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


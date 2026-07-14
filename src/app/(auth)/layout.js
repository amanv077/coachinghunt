import { BrandPanel } from "@/components/shared/BrandPanel";
import { AuthHeader } from "@/components/shared/AuthHeader";
import { AuthMobileBrand } from "@/components/shared/AuthMobileBrand";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <BrandPanel />

      <div className="flex flex-1 flex-col justify-start px-4 pb-10 pt-6 sm:px-6 md:justify-center md:px-12 md:py-10 lg:px-16">
        <div className="mx-auto w-full max-w-md md:max-w-lg">
          <AuthMobileBrand />
          <AuthHeader />
          <main className="mt-2">{children}</main>
        </div>
      </div>
    </div>
  );
}

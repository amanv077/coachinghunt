import { AuthHeader } from "@/components/shared/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <AuthHeader />
        {children}
      </div>
    </div>
  );
}

"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import { CompareProvider } from "@/components/shared/CompareContext";
import { RecentlyViewedProvider } from "@/components/shared/RecentlyViewedContext";
import { CompareBar } from "@/components/shared/CompareBar";
import { PWARegister } from "@/components/shared/PWARegister";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ToastProvider>
        <CompareProvider>
          <RecentlyViewedProvider>
            {children}
            <CompareBar />
            <PWARegister />
          </RecentlyViewedProvider>
        </CompareProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

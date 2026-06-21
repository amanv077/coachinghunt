"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import { CompareProvider } from "@/components/shared/CompareContext";
import { CompareBar } from "@/components/shared/CompareBar";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ToastProvider>
        <CompareProvider>
          {children}
          <CompareBar />
        </CompareProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

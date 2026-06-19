"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import { CompareProvider } from "@/components/shared/CompareContext";
import { CompareBar } from "@/components/shared/CompareBar";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CompareProvider>
          {children}
          <CompareBar />
        </CompareProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

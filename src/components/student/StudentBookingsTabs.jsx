"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function StudentBookingsTabs({ bookingsContent, requestsContent, pendingCount = 0 }) {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div>
      <div className="flex gap-1 rounded-xl border border-border bg-surface-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={cn(
            "min-h-11 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            activeTab === "bookings"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          Bookings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={cn(
            "min-h-11 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            activeTab === "requests"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          Requests
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "bookings" ? bookingsContent : requestsContent}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function register() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        // Force update so v2 SW replaces the broken cache-first "/" shell.
        await registration.update();

        if (cancelled) return;

        // If a new worker is waiting, activate it immediately.
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          registration.waiting.postMessage("skipWaiting");
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              // New SW installed; claim will happen via skipWaiting in sw.js
            }
          });
        });
      } catch (err) {
        console.error("Service worker registration failed:", err);
      }
    }

    register();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

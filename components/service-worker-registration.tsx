"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Unregister any existing service workers to disable caching
      const unregisterSW = async () => {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log("Service Worker unregistered:", registration);
          }

          // Clear all caches
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map((cacheName) => caches.delete(cacheName))
            );
            console.log("All caches cleared");
          }

          // Force a hard reload after unregistering
          window.location.reload();
        } catch (error) {
          console.error("Service Worker unregistration failed:", error);
        }
      };

      // Only run once when component mounts
      if (navigator.serviceWorker.controller) {
        unregisterSW();
      }
    }
  }, []);

  return null;
}

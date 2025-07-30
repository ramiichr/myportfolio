"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        // In production, register the hard reload service worker
        const registerHardReloadSW = async () => {
          try {
            // First, unregister any existing service workers
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
              console.log("Unregistered old SW:", registration);
            }

            // Clear all caches
            if ("caches" in window) {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
              );
              console.log("All caches cleared:", cacheNames);
            }

            // Register the new hard reload service worker
            const registration = await navigator.serviceWorker.register(
              "/sw.js",
              {
                scope: "/",
                updateViaCache: "none", // Never cache the service worker
              }
            );

            console.log("Hard Reload SW registered:", registration);

            // Force immediate activation
            if (registration.installing) {
              registration.installing.postMessage({ type: "SKIP_WAITING" });
            }

            // Listen for updates and force reload
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed") {
                    // Force reload to get fresh content
                    console.log("SW updated, forcing reload");
                    window.location.reload();
                  }
                });
              }
            });
          } catch (error) {
            console.error("Hard Reload SW registration failed:", error);
          }
        };

        registerHardReloadSW();
      } else {
        // In development, aggressively unregister all service workers
        const unregisterAllSW = async () => {
          try {
            const registrations =
              await navigator.serviceWorker.getRegistrations();

            for (const registration of registrations) {
              await registration.unregister();
              console.log("Service Worker unregistered:", registration);
            }

            // Clear all caches aggressively
            if ("caches" in window) {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
              );
              console.log("All caches cleared:", cacheNames);
            }

            // Clear additional browser storage
            if (typeof localStorage !== "undefined") {
              try {
                localStorage.clear();
              } catch (e) {
                console.warn("Could not clear localStorage:", e);
              }
            }

            if (typeof sessionStorage !== "undefined") {
              try {
                sessionStorage.clear();
              } catch (e) {
                console.warn("Could not clear sessionStorage:", e);
              }
            }

            // Clear IndexedDB (if any)
            if ("indexedDB" in window) {
              try {
                const databases = await indexedDB.databases();
                databases.forEach((db) => {
                  if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                  }
                });
              } catch (e) {
                console.warn("Could not clear IndexedDB:", e);
              }
            }
          } catch (error) {
            console.error("Service Worker cleanup failed:", error);
          }
        };

        unregisterAllSW();
      }
    }
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only track in production
    if (process.env.NODE_ENV !== "production") return;

    const trackWebVitals = () => {
      try {
        // Basic performance tracking
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === "largest-contentful-paint") {
                console.log("LCP:", entry.startTime.toFixed(2) + "ms");
              } else if (entry.entryType === "navigation") {
                const navEntry = entry as PerformanceNavigationTiming;
                const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
                console.log("Page Load Time:", loadTime.toFixed(2) + "ms");
              } else if (entry.entryType === "paint") {
                console.log(
                  `${entry.name}:`,
                  entry.startTime.toFixed(2) + "ms"
                );
              }
            });
          });

          // Observe different metrics with error handling
          try {
            observer.observe({ entryTypes: ["largest-contentful-paint"] });
          } catch (e) {
            // Silently fail if not supported
          }

          try {
            observer.observe({ entryTypes: ["navigation"] });
          } catch (e) {
            // Silently fail if not supported
          }

          try {
            observer.observe({ entryTypes: ["paint"] });
          } catch (e) {
            // Silently fail if not supported
          }

          // Cleanup after 30 seconds to prevent memory leaks
          setTimeout(() => {
            observer.disconnect();
          }, 30000);
        }
      } catch (error) {
        console.warn("Failed to initialize web vitals tracking:", error);
      }
    };

    // Load and track web vitals after a delay to not block initial render
    setTimeout(trackWebVitals, 1000);
  }, []);

  return null;
}

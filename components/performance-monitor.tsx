"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and when PerformanceObserver is available
    if (
      process.env.NODE_ENV === "development" ||
      typeof window === "undefined" ||
      !("PerformanceObserver" in window)
    ) {
      return;
    }

    // Throttle performance logging
    let lastLogTime = 0;
    const logThrottle = 5000; // 5 seconds

    // Monitor Core Web Vitals and critical metrics
    const observer = new PerformanceObserver((list) => {
      const now = Date.now();
      if (now - lastLogTime < logThrottle) return;

      list.getEntries().forEach((entry) => {
        // Only log critical performance metrics
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log(
            "Page Load Time:",
            navEntry.loadEventEnd - navEntry.fetchStart
          );
        } else if (entry.entryType === "paint") {
          console.log(`${entry.name}:`, entry.startTime);
        } else if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
      });

      lastLogTime = now;
    });

    try {
      // Observe Core Web Vitals with error handling
      observer.observe({ entryTypes: ["navigation", "paint"] });

      // Only observe LCP if supported
      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch {
        console.warn("LCP observation not supported");
      }
    } catch (e) {
      console.warn("PerformanceObserver not fully supported");
    }

    // Cleanup function
    return () => {
      try {
        observer.disconnect();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  return null;
}

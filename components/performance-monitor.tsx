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

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Log performance metrics for monitoring
        console.log(`Performance: ${entry.name}: ${entry.duration || "N/A"}`);
      });
    });

    try {
      // Observe Core Web Vitals
      observer.observe({ entryTypes: ["measure", "navigation", "paint"] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn("PerformanceObserver not fully supported");
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

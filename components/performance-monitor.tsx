"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Service Worker registration failed:", error);
      });
    }

    // Monitor Core Web Vitals
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });

    // Preload critical resources
    const preloadLinks = [
      { href: "/optimized/rami.webp", as: "image" },
      { href: "/optimized/profile.webp", as: "image" },
    ];

    preloadLinks.forEach(({ href, as }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    });

    // Performance observer for long tasks
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn("Long task detected:", entry);
            sendToAnalytics({
              name: "long-task",
              value: entry.duration,
              id: "LT",
            });
          }
        });
      });

      observer.observe({ entryTypes: ["longtask"] });
    }
  }, []);

  return null;
}

function sendToAnalytics(metric: any) {
  if (process.env.NODE_ENV === "production") {
    // Send to analytics (Google Analytics, Vercel Analytics, etc.)
    if (window.gtag) {
      window.gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        non_interaction: true,
      });
    }

    console.log("Performance metric:", metric);
  }
}

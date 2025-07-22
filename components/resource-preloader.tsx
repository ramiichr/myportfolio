"use client";

import { useEffect } from "react";

interface ResourcePreloaderProps {
  resources?: string[];
}

export function ResourcePreloader({ resources = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof window === "undefined" || resources.length === 0) return;

    // Preload critical resources
    const defaultResources = [
      "/rami.png",
      "/portfolio.png",
      "/chatapp.png",
      "/exchangeflow.png",
      "/weather.png",
    ];

    const allResources = [...defaultResources, ...resources];

    // Use requestIdleCallback for non-critical preloading
    const preloadCallback = (deadline: IdleDeadline) => {
      let index = 0;

      while (deadline.timeRemaining() > 0 && index < allResources.length) {
        const resource = allResources[index];

        // Create link element for preloading
        const link = document.createElement("link");
        link.rel = "preload";

        if (
          resource.endsWith(".png") ||
          resource.endsWith(".jpg") ||
          resource.endsWith(".webp")
        ) {
          link.as = "image";
        } else if (resource.endsWith(".js")) {
          link.as = "script";
        } else if (resource.endsWith(".css")) {
          link.as = "style";
        }

        link.href = resource;

        // Only add if not already preloaded
        if (!document.querySelector(`link[href="${resource}"]`)) {
          document.head.appendChild(link);
        }

        index++;
      }
    };

    // Use requestIdleCallback with fallback
    if ("requestIdleCallback" in window) {
      requestIdleCallback(preloadCallback, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(
        () => preloadCallback({ timeRemaining: () => 50 } as IdleDeadline),
        100
      );
    }

    // Preload critical fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "preload";
    fontLink.as = "font";
    fontLink.type = "font/woff2";
    fontLink.crossOrigin = "anonymous";
    fontLink.href = "/fonts/inter-var.woff2"; // Adjust path as needed

    if (!document.querySelector('link[href="/fonts/inter-var.woff2"]')) {
      document.head.appendChild(fontLink);
    }
  }, [resources]);

  return null;
}

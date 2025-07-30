"use client";

import { useEffect } from "react";

export function ProductionHardReload() {
  useEffect(() => {
    // Check if hard reload is enabled and we're in production or deployed
    const isProduction = process.env.NODE_ENV === "production";
    const isDeployed = process.env.NEXT_PUBLIC_IS_DEPLOYED === "true";
    const forceHardReload =
      process.env.NEXT_PUBLIC_FORCE_HARD_RELOAD === "true";

    if (
      (!isProduction && !isDeployed && !forceHardReload) ||
      typeof window === "undefined"
    ) {
      return;
    }

    console.log("🔄 Production Hard Reload activated", {
      isProduction,
      isDeployed,
      forceHardReload,
    });

    // Force bypass all CDN and edge caches
    const bypassAllCaches = () => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);

      // Add cache-busting headers to current request
      const meta = document.createElement("meta");
      meta.httpEquiv = "Cache-Control";
      meta.content =
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate";
      document.head.appendChild(meta);

      // Force reload with multiple cache-busting parameters
      const currentUrl = new URL(window.location.href);

      // Clean up any existing cache-busting params first
      currentUrl.searchParams.delete("_t");
      currentUrl.searchParams.delete("_cb");
      currentUrl.searchParams.delete("_reload");
      currentUrl.searchParams.delete("v");

      // Add new cache-busting parameters
      currentUrl.searchParams.set("_t", timestamp.toString());
      currentUrl.searchParams.set("_cb", randomId);
      currentUrl.searchParams.set("v", timestamp.toString());

      // Use location.replace to avoid adding to browser history
      window.location.replace(currentUrl.toString());
    };

    // Clean URL after cache busting
    const cleanUrl = () => {
      const currentUrl = new URL(window.location.href);
      let changed = false;

      ["_t", "_cb", "_reload", "v"].forEach((param) => {
        if (currentUrl.searchParams.has(param)) {
          currentUrl.searchParams.delete(param);
          changed = true;
        }
      });

      if (changed) {
        window.history.replaceState({}, "", currentUrl.toString());
      }
    };

    // Check if we need to clean the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("_t") || urlParams.has("_cb") || urlParams.has("v")) {
      cleanUrl();
    }

    // Override browser refresh behavior
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        event.stopPropagation();

        console.log("🔄 Production hard reload triggered");
        bypassAllCaches();
      }
    };

    // Prevent default refresh behavior
    window.addEventListener("keydown", handleKeyDown, true);

    // Force refresh every time the page gains focus (for deployed version)
    const handleFocus = () => {
      // Small delay to avoid excessive reloads
      setTimeout(() => {
        if (document.visibilityState === "visible") {
          console.log("🔄 Page focus - triggering hard reload");
          bypassAllCaches();
        }
      }, 1000);
    };

    // Only add focus listener in production
    document.addEventListener("visibilitychange", handleFocus);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  return null;
}

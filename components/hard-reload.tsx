"use client";

import { useEffect } from "react";

export function HardReload() {
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return;

    // Helper function for reloading
    const performReload = () => {
      window.location.reload();
    };

    // Clean up URL on initial load
    const cleanupUrl = () => {
      const currentUrl = new URL(window.location.href);
      let urlChanged = false;

      // Remove cache-busting parameters
      if (currentUrl.searchParams.has("_t")) {
        currentUrl.searchParams.delete("_t");
        urlChanged = true;
      }
      if (currentUrl.searchParams.has("_hard_reload")) {
        currentUrl.searchParams.delete("_hard_reload");
        urlChanged = true;
      }
      if (currentUrl.searchParams.has("_cb")) {
        currentUrl.searchParams.delete("_cb");
        urlChanged = true;
      }

      if (urlChanged) {
        window.history.replaceState({}, "", currentUrl.toString());
      }
    };

    // Clean up URL immediately
    cleanupUrl();

    // Force hard reload by adding a unique timestamp to URL on each visit
    const forceHardReload = () => {
      // Instead of modifying the URL, use other cache-busting techniques
      // The URL cleanup above already handles removing any existing parameters

      // Force reload of all stylesheets and scripts
      const timestamp = Date.now();

      // Reload stylesheets
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
      styleSheets.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && !href.includes("googleapis")) {
          const newHref = href.split("?")[0] + "?v=" + timestamp;
          link.setAttribute("href", newHref);
        }
      });
    };

    // Add timestamp to prevent browser caching
    const addTimestampToLinks = () => {
      const timestamp = Date.now();

      // Add timestamp to all CSS links
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && !href.includes("?") && !href.includes("googleapis")) {
          link.setAttribute("href", `${href}?v=${timestamp}`);
        }
      });

      // Add timestamp to all script sources
      const scripts = document.querySelectorAll("script[src]");
      scripts.forEach((script) => {
        const src = script.getAttribute("src");
        if (
          src &&
          !src.includes("?") &&
          !src.includes("googleapis") &&
          !src.includes("vercel")
        ) {
          script.setAttribute("src", `${src}?v=${timestamp}`);
        }
      });
    };

    // Force hard reload on navigation
    const handleBeforeUnload = () => {
      // Clear localStorage cache indicators
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.includes("cache") || key.includes("timestamp")) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    };

    // Disable browser cache for current session
    const disableBrowserCache = () => {
      // Add meta tags to disable caching if they don't exist
      if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
        const metaTag = document.createElement("meta");
        metaTag.httpEquiv = "Cache-Control";
        metaTag.content = "no-cache, no-store, must-revalidate";
        document.head.appendChild(metaTag);
      }

      if (!document.querySelector('meta[http-equiv="Pragma"]')) {
        const pragmaTag = document.createElement("meta");
        pragmaTag.httpEquiv = "Pragma";
        pragmaTag.content = "no-cache";
        document.head.appendChild(pragmaTag);
      }

      if (!document.querySelector('meta[http-equiv="Expires"]')) {
        const expiresTag = document.createElement("meta");
        expiresTag.httpEquiv = "Expires";
        expiresTag.content = "0";
        document.head.appendChild(expiresTag);
      }
    };

    // Add keyboard shortcut for hard reload
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+R or F5 - force hard reload without URL changes
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();

        // Clear caches and reload
        if ("caches" in window) {
          caches
            .keys()
            .then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
              );
            })
            .then(() => {
              performReload();
            })
            .catch(() => {
              performReload();
            });
        } else {
          performReload();
        }
      }

      // Ctrl+Shift+R - super hard reload without URL changes
      if (event.ctrlKey && event.shiftKey && event.key === "R") {
        event.preventDefault();

        // Clear all browser storage and caches
        try {
          // Clear localStorage
          localStorage.clear();
          // Clear sessionStorage
          sessionStorage.clear();
          // Clear caches
          if ("caches" in window) {
            caches
              .keys()
              .then((cacheNames) => {
                return Promise.all(
                  cacheNames.map((cacheName) => caches.delete(cacheName))
                );
              })
              .then(() => {
                performReload();
              })
              .catch(() => {
                performReload();
              });
          } else {
            performReload();
          }
        } catch (error) {
          console.warn("Could not clear all storage:", error);
          performReload();
        }
      }
    };

    // Apply all cache prevention measures
    forceHardReload();
    addTimestampToLinks();
    disableBrowserCache();

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

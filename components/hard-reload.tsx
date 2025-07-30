"use client";

import { useEffect } from "react";

export function HardReload() {
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return;

    // Helper function for reloading
    const performReload = () => {
      // Add timestamp to current URL to bypass all caches
      const url = new URL(window.location.href);
      url.searchParams.set("_cache_bust", Date.now().toString());
      url.searchParams.set("_reload", "1");
      window.location.replace(url.toString());
    };

    // More aggressive cache busting for production
    const aggressiveCacheBust = () => {
      const timestamp = Date.now();

      // Force reload of all stylesheets
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
      styleSheets.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && !href.includes("googleapis")) {
          const newLink = document.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href =
            href.split("?")[0] + "?v=" + timestamp + "&cb=" + Math.random();
          newLink.onload = () => {
            if (link.parentNode) {
              link.parentNode.removeChild(link);
            }
          };
          document.head.appendChild(newLink);
        }
      });

      // Force reload of all scripts (for dynamic scripts)
      const scripts = document.querySelectorAll("script[src]");
      scripts.forEach((script) => {
        const src = script.getAttribute("src");
        if (
          src &&
          !src.includes("googleapis") &&
          !src.includes("vercel") &&
          !src.includes("analytics")
        ) {
          const scriptElement = script as HTMLScriptElement;
          const newScript = document.createElement("script");
          newScript.src =
            src.split("?")[0] + "?v=" + timestamp + "&cb=" + Math.random();
          newScript.async = scriptElement.async;
          newScript.defer = scriptElement.defer;
          document.head.appendChild(newScript);
        }
      });
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
      if (currentUrl.searchParams.has("_cache_bust")) {
        currentUrl.searchParams.delete("_cache_bust");
        urlChanged = true;
      }
      if (currentUrl.searchParams.has("_reload")) {
        currentUrl.searchParams.delete("_reload");
        urlChanged = true;
      }

      if (urlChanged) {
        window.history.replaceState({}, "", currentUrl.toString());
      }
    };

    // Clean up URL first
    cleanupUrl();

    // Force hard reload by adding a unique timestamp to URL on each visit
    const forceHardReload = () => {
      // In production, be more aggressive
      if (process.env.NODE_ENV === "production") {
        aggressiveCacheBust();
      }

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
          link.setAttribute(
            "href",
            `${href}?v=${timestamp}&cb=${Math.random()}`
          );
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
          !src.includes("vercel") &&
          !src.includes("analytics")
        ) {
          script.setAttribute(
            "src",
            `${src}?v=${timestamp}&cb=${Math.random()}`
          );
        }
      });
    };

    // Force hard reload on navigation
    const handleBeforeUnload = () => {
      // Clear localStorage cache indicators
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (
            key.includes("cache") ||
            key.includes("timestamp") ||
            key.includes("next")
          ) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    };

    // Disable browser cache for current session - More aggressive for production
    const disableBrowserCache = () => {
      // Add meta tags to disable caching if they don't exist
      const addMetaTag = (httpEquiv: string, content: string) => {
        if (!document.querySelector(`meta[http-equiv="${httpEquiv}"]`)) {
          const metaTag = document.createElement("meta");
          metaTag.httpEquiv = httpEquiv;
          metaTag.content = content;
          document.head.appendChild(metaTag);
        }
      };

      addMetaTag(
        "Cache-Control",
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0"
      );
      addMetaTag("Pragma", "no-cache");
      addMetaTag("Expires", "0");

      // Additional meta tags for production
      if (process.env.NODE_ENV === "production") {
        addMetaTag("Surrogate-Control", "no-store");
        addMetaTag("X-Accel-Expires", "0");
      }
    };

    // Production-specific cache clearing
    const clearProductionCaches = async () => {
      if (process.env.NODE_ENV === "production") {
        try {
          // Clear all possible caches
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
          }

          // Clear application cache (legacy)
          if ("applicationCache" in window && window.applicationCache) {
            try {
              (window.applicationCache as any).swapCache();
            } catch (e) {
              // Ignore if not available
            }
          }

          // Force reload of main document
          if (document.documentElement) {
            document.documentElement.setAttribute(
              "data-cache-bust",
              Date.now().toString()
            );
          }
        } catch (error) {
          console.warn("Production cache clearing failed:", error);
        }
      }
    };

    // Add keyboard shortcut for hard reload
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+R or F5 - force hard reload without URL changes
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();

        // In production, use more aggressive reload
        if (process.env.NODE_ENV === "production") {
          clearProductionCaches().then(() => {
            performReload();
          });
        } else {
          // Development mode
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

          clearProductionCaches().then(() => {
            performReload();
          });
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

    // Run production cache clearing on load
    if (process.env.NODE_ENV === "production") {
      clearProductionCaches();
    }

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    // Production-specific: Force reload every 30 seconds to ensure fresh content
    let productionReloadInterval: NodeJS.Timeout;
    if (process.env.NODE_ENV === "production") {
      productionReloadInterval = setInterval(() => {
        // Check if content might be stale and refresh if needed
        const lastReload = sessionStorage.getItem("lastReload");
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload) > 30000) {
          sessionStorage.setItem("lastReload", now.toString());
          aggressiveCacheBust();
        }
      }, 30000);
    }

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
      if (productionReloadInterval) {
        clearInterval(productionReloadInterval);
      }
    };
  }, []);

  return null;
}

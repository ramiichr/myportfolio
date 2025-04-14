import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Paths that should be excluded from tracking
const EXCLUDED_PATHS = ["/dashboard"];

/**
 * Custom hook for tracking page views
 *
 * This hook sends page view data to the tracking API when a user visits a page.
 * It skips tracking for excluded paths and when tracking is disabled.
 */
export function usePageTracking() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip if this path was already tracked (prevents duplicate tracking on re-renders)
    if (lastTrackedPath.current === pathname) {
      return;
    }

    // Update the last tracked path
    lastTrackedPath.current = pathname;

    // Skip tracking if disabled via environment variable
    if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") {
      return;
    }

    // Skip tracking for excluded paths
    if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
      return;
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
          }),
        });
      } catch (error) {
        // Silent fail - don't affect user experience if tracking fails
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to track page view:", error);
        }
      }
    };

    // Track the page view
    trackPageView();
  }, [pathname]);
}

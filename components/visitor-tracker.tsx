"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackVisitor } from "@/lib/api";

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname.startsWith("/admin")) {
      return;
    }

    // Combine pathname and search params to get the full path
    const fullPath =
      searchParams.size > 0
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

    // Only track if this is the first render or if the path has changed
    // This prevents duplicate tracking on client-side navigation
    if (isFirstRender.current || lastTrackedPath.current !== fullPath) {
      // Add a small delay to ensure the page has fully loaded
      const trackingTimeout = setTimeout(() => {
        trackVisitor().catch((error) => {
          // Log error but don't disrupt user experience
          console.error("Failed to track visitor:", error);
        });

        // Update tracking state
        isFirstRender.current = false;
        lastTrackedPath.current = fullPath;
      }, 500);

      return () => clearTimeout(trackingTimeout);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

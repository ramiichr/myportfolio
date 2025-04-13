"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitor } from "@/lib/api";

export default function VisitorTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname.startsWith("/admin")) {
      return;
    }

    // Only track if this is the first render or if the path has changed
    // This prevents duplicate tracking on client-side navigation
    if (isFirstRender.current || lastTrackedPath.current !== pathname) {
      // Add a small delay to ensure the page has fully loaded
      const trackingTimeout = setTimeout(() => {
        trackVisitor().catch((error) => {
          // Log error but don't disrupt user experience
          console.error("Failed to track visitor:", error);
        });

        // Update tracking state
        isFirstRender.current = false;
        lastTrackedPath.current = pathname;
      }, 500);

      return () => clearTimeout(trackingTimeout);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

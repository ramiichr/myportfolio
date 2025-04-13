"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitor } from "@/lib/api";

export default function VisitorTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const lastTrackedPath = useRef("");
  const trackingAttempted = useRef(false);

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
        // Track the visit
        trackVisitor()
          .then(() => {
            console.log("Visit tracked successfully");
            trackingAttempted.current = true;
          })
          .catch((error) => {
            // Log error but don't disrupt user experience
            console.error("Failed to track visitor:", error);

            // If first attempt failed, try once more after a delay
            if (!trackingAttempted.current) {
              setTimeout(() => {
                trackVisitor().catch((retryError) => {
                  console.error("Retry failed to track visitor:", retryError);
                });
                trackingAttempted.current = true;
              }, 2000);
            }
          });

        // Update tracking state
        isFirstRender.current = false;
        lastTrackedPath.current = pathname;
      }, 1000); // Increased delay to ensure page is fully loaded

      return () => clearTimeout(trackingTimeout);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

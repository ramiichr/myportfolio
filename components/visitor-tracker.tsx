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

    // Reset tracking attempted flag when path changes
    if (lastTrackedPath.current !== pathname) {
      trackingAttempted.current = false;
    }

    // Only track if this is the first render or if the path has changed
    // This prevents duplicate tracking on client-side navigation
    if (isFirstRender.current || lastTrackedPath.current !== pathname) {
      // Add a small delay to ensure the page has fully loaded
      const trackingTimeout = setTimeout(() => {
        // Track the visit with the current pathname
        trackVisitor(pathname)
          .then(() => {
            console.log(`Visit to ${pathname} tracked successfully`);
            trackingAttempted.current = true;
          })
          .catch((error) => {
            // Log error but don't disrupt user experience
            console.error(`Failed to track visitor for ${pathname}:`, error);

            // If first attempt failed, try once more after a delay
            if (!trackingAttempted.current) {
              setTimeout(() => {
                trackVisitor(pathname)
                  .then(() => {
                    console.log(
                      `Retry: Visit to ${pathname} tracked successfully`
                    );
                  })
                  .catch((retryError) => {
                    console.error(
                      `Retry failed to track visitor for ${pathname}:`,
                      retryError
                    );
                  });
                trackingAttempted.current = true;
              }, 2000);
            }
          });

        // Update tracking state
        isFirstRender.current = false;
        lastTrackedPath.current = pathname;
      }, 500); // Reduced delay for faster tracking

      return () => clearTimeout(trackingTimeout);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

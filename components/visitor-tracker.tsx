"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Only track visitors on the client side
    const trackVisit = async () => {
      try {
        // Check if this visit has already been tracked in this session
        const hasTracked = sessionStorage.getItem("visit_tracked");

        if (!hasTracked) {
          // Add a small delay to ensure the page loads first
          setTimeout(async () => {
            try {
              // Track the visit with retry logic
              const response = await fetch("/api/track-visitor", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // Ensure we don't cache the request
                cache: "no-store",
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              // Mark as tracked in this session
              sessionStorage.setItem("visit_tracked", "true");

              // Log success in development
              if (process.env.NODE_ENV === "development") {
                console.log("Visit tracked successfully");
              }
            } catch (retryError) {
              console.warn(
                "First tracking attempt failed, retrying once:",
                retryError
              );

              // Wait a bit and retry once
              setTimeout(async () => {
                try {
                  const retryResponse = await fetch("/api/track-visitor", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    cache: "no-store",
                  });

                  if (!retryResponse.ok) {
                    throw new Error(
                      `HTTP error! status: ${retryResponse.status}`
                    );
                  }

                  sessionStorage.setItem("visit_tracked", "true");

                  // Log retry success in development
                  if (process.env.NODE_ENV === "development") {
                    console.log("Visit tracked successfully after retry");
                  }
                } catch (finalError) {
                  // Give up after second attempt
                  console.error(
                    "Failed to track visit after retry:",
                    finalError
                  );
                }
              }, 3000);
            }
          }, 1000);
        }
      } catch (error) {
        // Silently fail to not disrupt user experience
        console.error("Failed to track visit:", error);
      }
    };

    // Only run in browser environment and if not in test mode
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
      trackVisit();
    }

    // No cleanup needed
  }, []);

  // This component doesn't render anything visible
  return null;
}

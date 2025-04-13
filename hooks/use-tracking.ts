import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip tracking if disabled
    if (process.env.NEXT_PUBLIC_ENABLE_TRACKING !== "true") {
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
        console.error("Failed to track page view:", error);
      }
    };

    // Track the page view
    trackPageView();
  }, [pathname]);
}

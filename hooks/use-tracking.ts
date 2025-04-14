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
        // Try to get client IP for debugging purposes
        let clientIp = null;
        try {
          // This is just for debugging - the server should determine the real IP
          const ipResponse = await fetch("https://api.ipify.org?format=json");
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            clientIp = ipData.ip;
          }
        } catch (ipError) {
          console.log("Could not determine client IP:", ipError);
        }

        await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
            clientIp: clientIp, // Include client IP for debugging
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

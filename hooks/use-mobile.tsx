import { useState, useEffect } from "react";

// Breakpoint for mobile devices (in pixels)
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile-sized
 *
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile() {
  // Use undefined as initial state to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Function to check if the screen is mobile-sized
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Create media query list
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    // Set initial value
    checkMobile();

    // Add event listener for changes
    mediaQuery.addEventListener("change", checkMobile);

    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", checkMobile);
    };
  }, []);

  // Return false during SSR, and the actual value after hydration
  return isMobile === undefined ? false : isMobile;
}

import { useEffect, useState } from "react";

export function usePagePadding() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    paddingTop: "8rem",
    paddingBottom: "6rem",
    paddingLeft: isMobile ? "1rem" : "1.5rem",
    paddingRight: isMobile ? "1rem" : "1.5rem",
  };
}

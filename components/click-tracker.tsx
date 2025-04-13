"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackClickEvent } from "@/lib/api";

export default function ClickTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname.startsWith("/admin")) {
      return;
    }

    // Function to handle click events
    const handleClick = (event: MouseEvent) => {
      // Get the clicked element
      const target = event.target as HTMLElement;

      // Skip tracking for admin-related elements
      if (target.closest('[data-admin="true"]')) {
        return;
      }

      // Get element information
      const elementId = target.id || "unknown";
      const elementType = target.tagName.toLowerCase() || "unknown";
      const elementText = target.textContent?.trim().substring(0, 100) || "";

      // Build element path (e.g., "div > button > span")
      let elementPath = "";
      let currentElement: HTMLElement | null = target;
      const maxDepth = 5; // Limit the depth to avoid overly long paths
      let depth = 0;

      while (currentElement && depth < maxDepth) {
        const tag = currentElement.tagName.toLowerCase();
        const id = currentElement.id ? `#${currentElement.id}` : "";
        const classes =
          currentElement.className &&
          typeof currentElement.className === "string"
            ? `.${currentElement.className.split(" ").join(".")}`
            : "";

        elementPath = elementPath
          ? `${tag}${id}${classes} > ${elementPath}`
          : `${tag}${id}${classes}`;

        currentElement = currentElement.parentElement;
        depth++;
      }

      // Track the click event
      trackClickEvent({
        elementId,
        elementType,
        elementText,
        elementPath,
        currentPath: pathname,
        x: event.clientX,
        y: event.clientY,
      })
        .then(() => {
          console.log(`Click on ${elementType} tracked successfully`);
        })
        .catch((error) => {
          // Log error but don't disrupt user experience
          console.error(`Failed to track click:`, error);
        });
    };

    // Add click event listener to the document
    document.addEventListener("click", handleClick);

    // Set first render to false
    isFirstRender.current = false;

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

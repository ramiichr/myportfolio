"use client";

import { useEffect } from "react";

export function FontLoader() {
  useEffect(() => {
    // Check if fonts are already loaded
    if (document.documentElement.classList.contains("fonts-loaded")) {
      return;
    }

    // Use the Font Loading API if available
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add("fonts-loaded");
      });
    } else {
      // Fallback: assume fonts are loaded after a short delay
      setTimeout(() => {
        document.documentElement.classList.add("fonts-loaded");
      }, 100);
    }
  }, []);

  return null;
}

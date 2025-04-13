"use client";

import { usePageTracking } from "@/hooks/use-tracking";

export function PageTracker() {
  // This component doesn't render anything visible
  // It just uses the tracking hook
  usePageTracking();

  return null;
}

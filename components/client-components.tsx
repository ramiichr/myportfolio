"use client";

import dynamic from "next/dynamic";

// Lazy load non-critical components for client-side only
const CursorLight = dynamic(() => import("@/components/cursor-light"), {
  ssr: false,
  loading: () => null,
});

const PerformanceMonitor = dynamic(
  () =>
    import("@/components/performance-monitor").then((mod) => ({
      default: mod.PerformanceMonitor,
    })),
  {
    ssr: false,
  }
);

export function ClientComponents() {
  return (
    <>
      <PerformanceMonitor />
      <CursorLight />
    </>
  );
}

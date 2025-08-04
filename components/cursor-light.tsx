"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CursorLight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isMouseInWindow, setIsMouseInWindow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if device is mobile to disable cursor effects
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    let rafId: number;

    const updateMousePosition = (e: MouseEvent) => {
      if (isMobile) return;
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseEnter = () => {
      if (!isMobile) setIsMouseInWindow(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInWindow(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  const gradientStyle = useMemo(
    () => ({
      background: `radial-gradient(circle 2500px at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.35), transparent 50%)`,
    }),
    [mousePosition.x, mousePosition.y]
  );

  if (!isClient || isMobile) return null;

  return (
    <AnimatePresence>
      {isMouseInWindow && (
        <>
          <motion.div
            className="cursor-outline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          />
          <motion.div
            className="pointer-events-none fixed inset-0 -z-[1] will-change-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={gradientStyle}
          />
        </>
      )}
    </AnimatePresence>
  );
}

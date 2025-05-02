"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CursorLight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isMouseInWindow, setIsMouseInWindow] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsMouseInWindow(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInWindow(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isMouseInWindow && (
        <>
          <motion.div
            className="pointer-events-none fixed inset-0 -z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle 2000px at ${mousePosition.x}px ${mousePosition.y}px, rgba(21, 0, 255, 0.258), transparent 50%)`,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

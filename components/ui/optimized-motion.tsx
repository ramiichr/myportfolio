"use client";

import { motion } from "framer-motion";
import { ReactNode, memo } from "react";

// Optimized motion wrapper without lazy loading
export const OptimizedMotion = memo(function OptimizedMotion({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: any;
}) {
  return <motion.div {...props}>{children}</motion.div>;
});

// Lightweight fade animation for performance (optimized for smoothness)
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Container for staggered animations (smoother)
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Optimized hover animation (faster)
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.1, ease: "easeOut" },
};

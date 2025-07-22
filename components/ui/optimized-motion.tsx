"use client";

import { motion, LazyMotion, domAnimation } from "framer-motion";
import { ReactNode, memo } from "react";

// Optimized motion wrapper with reduced feature set
export const OptimizedMotion = memo(function OptimizedMotion({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: any;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div {...props}>{children}</motion.div>
    </LazyMotion>
  );
});

// Lightweight fade animation for performance
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Container for staggered animations
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Optimized hover animation
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeOut" },
};

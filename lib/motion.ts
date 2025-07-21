import { lazy } from "react";

// Lazy load heavy animation components
export const LazyMotion = lazy(() =>
  import("framer-motion").then((module) => ({
    default: module.LazyMotion,
  }))
);

export const LazyMotionDiv = lazy(() =>
  import("framer-motion").then((module) => ({
    default: module.motion.div,
  }))
);

export const LazyAnimatePresence = lazy(() =>
  import("framer-motion").then((module) => ({
    default: module.AnimatePresence,
  }))
);

// Preload critical animations
export const loadFramerMotion = () => {
  return import("framer-motion");
};

// Motion variants for better performance
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleInOut = {
  hidden: { scale: 0.8, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

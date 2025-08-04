// Motion variants for better performance (optimized for speed)
export const fadeInUp = {
  hidden: {
    opacity: 0.8, // Less dramatic starting opacity
    y: 10, // Reduced movement
    transition: {
      duration: 0.2, // Smooth animation
      ease: "easeOut",
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, // Smooth animation
      ease: "easeOut",
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0.9 }, // Less dramatic
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Slightly slower stagger for smoother effect
      delayChildren: 0.1, // Longer delay for better visual flow
    },
  },
};

export const scaleInOut = {
  hidden: { scale: 0.95, opacity: 0.9 }, // Less dramatic
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200, // Faster spring
      damping: 15, // Less damping
    },
  },
};

// New optimized variant for text elements
export const textFadeIn = {
  hidden: {
    opacity: 0.7, // High initial opacity to prevent flash
    y: 5, // Minimal movement
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, // Smooth animation
      ease: "easeOut",
    },
  },
};

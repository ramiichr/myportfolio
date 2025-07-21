"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile | null;
  translations: any;
  calculateMovement: (axis: "x" | "y", strength?: number) => number;
}

export function HeroSection({
  profile,
  translations,
  calculateMovement,
}: HeroSectionProps) {
  const heroAnimations = useMemo(
    () => ({
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 },
    }),
    []
  );

  return (
    <section className="relative min-h-[90vh] py-16 md:py-0 flex items-center justify-center overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-0">
          <motion.div
            className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-20"
            {...heroAnimations}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {translations.hero.greeting}{" "}
              <span className="text-primary">{profile?.name}</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">
              {profile?.title}
            </h2>
            <p className="max-w-[600px] text-muted-background md:text-lg mx-auto md:mx-0">
              {profile?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start relative z-30">
              <Button size="lg" asChild className="relative">
                <a href="#projects" className="relative z-30">
                  {translations.hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <div className="w-full md:w-1/2 relative">
            <div className="h-[350px] md:h-[600px] relative">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <motion.div
                  className="absolute w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full bg-primary/5 dark:bg-primary/10"
                  animate={{
                    scale: [1, 1.05, 1],
                    x: calculateMovement("x", 10),
                    y: calculateMovement("y", 10),
                  }}
                  transition={{
                    scale: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 4,
                      ease: "easeInOut",
                    },
                    x: { type: "spring", stiffness: 50 },
                    y: { type: "spring", stiffness: 50 },
                  }}
                />

                <motion.div
                  className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full bg-primary/10 dark:bg-primary/15"
                  animate={{
                    scale: [1, 1.1, 1],
                    x: calculateMovement("x", 20),
                    y: calculateMovement("y", 20),
                  }}
                  transition={{
                    scale: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      ease: "easeInOut",
                      delay: 0.5,
                    },
                    x: { type: "spring", stiffness: 75 },
                    y: { type: "spring", stiffness: 75 },
                  }}
                />

                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <motion.div
                    className="relative w-[250px] h-[250px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-4 border-background shadow-xl"
                    animate={{
                      x: calculateMovement("x", -15),
                      y: calculateMovement("y", -15),
                      rotateY: calculateMovement("x", 5),
                      rotateX: calculateMovement("y", -5),
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 75,
                      damping: 30,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <OptimizedImage
                      src="/profile.png"
                      alt="Profile"
                      fill
                      className="object-cover object-[center_top]"
                      priority
                      sizes="(max-width: 768px) 250px, 380px"
                      quality={90}
                    />

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

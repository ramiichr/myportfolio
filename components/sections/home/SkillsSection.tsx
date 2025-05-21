"use client";

import { motion } from "framer-motion";
import StackIcon from "tech-stack-icons";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
  translations: any;
}

export function SkillsSection({ skills, translations }: SkillsSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-accent/50">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {translations.about.skills}
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skills.slice(0, 8).map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className="group relative flex flex-col items-center justify-center p-6 rounded-xl overflow-hidden backdrop-blur-effect skill-card-glow"
              style={{
                background: "rgba(var(--background), 0.8)",
              }}
            >
              {/* Skill icon */}
              <div className="mb-4 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-background border border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                    <StackIcon
                      name={skill.icon}
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Skill name */}
              <h3 className="font-medium text-lg mb-4 z-10">{skill.name}</h3>

              {/* No skill level display needed */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

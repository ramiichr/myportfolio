"use client";

import { motion } from "framer-motion";
import StackIcon from "tech-stack-icons";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
  translations: any;
}

export function SkillsSection({ skills, translations }: SkillsSectionProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section className="py-16 bg-accent/30">
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

        {/* Featured Skills - Show a mix from various categories */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {skills.slice(0, 12).map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-card-glow group relative flex flex-col items-center p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div className="relative mb-3 z-10">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm shadow-inner border border-border/50 group-hover:border-primary/30 transition-all">
                  <StackIcon
                    name={skill.icon}
                    className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <h3 className="font-medium text-sm z-10 group-hover:text-primary transition-colors">
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* View all skills button */}
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm text-sm font-medium transition-all hover:shadow-md hover:-translate-y-1"
            >
              {translations.skills.viewAll}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

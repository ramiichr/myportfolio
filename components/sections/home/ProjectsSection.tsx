"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/project-card";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
  translations: any;
}

export function ProjectsSection({
  projects,
  translations,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {translations.projects.title}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              translations={translations}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import ProjectCard from "@/components/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects } from "@/lib/api";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { translations, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getProjects(
          language,
          activeCategory === "all" ? undefined : activeCategory
        );
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [language, activeCategory]);

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

  return (
    <div className="container pt-32 pb-24 px-4 md:px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
          {translations.projects.title}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {translations.projects.description}
        </p>
      </motion.div>

      <Tabs
        defaultValue="all"
        className="w-full mb-12"
        onValueChange={setActiveCategory}
      >
        <div className="flex justify-center w-full">
          <TabsList className="w-full max-w-3xl">
            <TabsTrigger value="all">
              {translations.projects.categories.all}
            </TabsTrigger>
            <TabsTrigger value="web">
              {translations.projects.categories.web}
            </TabsTrigger>
            <TabsTrigger value="mobile">
              {translations.projects.categories.mobile}
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
          key={activeCategory} // Re-render animation when category changes
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              translations={translations}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

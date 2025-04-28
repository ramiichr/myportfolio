"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProfile, getProjects, getSkills } from "@/lib/api";
import type { Profile, Project, Skill } from "@/types";
import StackIcon from "tech-stack-icons";

export default function Home() {
  const { translations, language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [profileData, projectsData, skillsData] = await Promise.all([
          getProfile(language),
          getProjects(language, undefined, true), // Get featured projects
          getSkills(),
        ]);

        setProfile(profileData);
        setProjects(projectsData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateMovement = (axis: "x" | "y", strength = 1) => {
    const windowCenter =
      axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2;

    const mousePos = axis === "x" ? mousePosition.x : mousePosition.y;
    const offset = ((mousePos - windowCenter) / windowCenter) * strength;

    return offset;
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-4">
      {/* Hero Section with Animated Image */}
      <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center relative overflow-hidden">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center">
          <motion.div
            className="flex-1 space-y-4 text-center md:text-left z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {translations.hero.greeting}{" "}
              <span className="text-primary">{profile?.name}</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">
              {profile?.title}
            </h2>
            <p className="max-w-[600px] text-muted-background md:text-lg">
              {profile?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <a href="#projects">
                  {translations.hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <div className="flex-1 h-[400px] md:h-[600px] w-full mt-8 md:mt-0 relative">
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Animated circles in the background */}
              <motion.div
                className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary/5 dark:bg-primary/10"
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
                  x: { type: "spring", stiffness: 70 },
                  y: { type: "spring", stiffness: 70 },
                }}
              />
            </motion.div>

            {/* Profile image with animations */}
            <motion.div
              className="relative z-10 h-full w-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.div
                className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-4 border-background shadow-xl"
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
                <Image
                  src="/profile.png"
                  alt="Profile"
                  fill
                  className="object-cover object-[center_top]"
                  priority
                />

                {/* Animated gradient overlay */}
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
          </div>
        </div>
      </section>

      {/* Skills Section */}
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
                  background:
                    "linear-gradient(135deg, rgba(var(--card), 0.8), rgba(var(--card), 0.4))",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Animated background */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    clipPath: `circle(${skill.level * 20}% at 100% 0)`,
                  }}
                ></div>

                {/* Skill icon with animated glow */}
                {skill.icon !== "" && (
                  <div className="relative mb-5 z-10">
                    <div className="absolute -inset-3 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-background border border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                      <StackIcon
                        name={skill.icon}
                        className="w-8 h-8 text-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Skill name */}
                <h3 className="font-medium text-lg mb-4 z-10">{skill.name}</h3>

                {/* Skill level indicator - circular progress */}
                <div className="relative w-full h-2 bg-secondary/30 rounded-full overflow-hidden z-10">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    style={{
                      width: `${(skill.level / 5) * 100}%`,
                      boxShadow: "0 0 10px rgba(var(--primary), 0.5)",
                    }}
                  ></div>
                </div>

                {/* Animated dots based on skill level */}
                <div className="flex justify-center mt-3 z-10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                        i < skill.level
                          ? "bg-primary scale-100"
                          : "bg-secondary/50 scale-75"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Skill level text */}
                <div className="mt-2 text-xs text-muted-foreground z-10">
                  {translations.skills.level.replace(
                    "{level}",
                    skill.level.toString()
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {translations.projects.title}
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
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

      {/* Contact CTA */}
      <section className="py-16 bg-accent/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {translations.contact.title}
            </h2>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mb-8">
              {translations.contact.cta}
            </p>
            <Button size="lg" asChild>
              <a href="/contact">
                {translations.contact.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

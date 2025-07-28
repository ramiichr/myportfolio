"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProfile, getSkills, getExperiences, getEducation } from "@/lib/api";
import type { Profile, Skill, Experience, Education } from "@/types";
import StackIcon from "tech-stack-icons";

export default function AboutPage() {
  const { translations, language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [profileData, skillsData, experiencesData, educationData] =
          await Promise.all([
            getProfile(language),
            getSkills(),
            getExperiences(language),
            getEducation(language),
          ]);

        setProfile(profileData);
        setSkills(skillsData);
        setExperiences(experiencesData);
        setEducation(educationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container pt-32 pb-24 px-4 md:px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <motion.div
            className="md:w-1/3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-primary">
              <Image
                src="/profile.png"
                alt="Profile"
                fill
                priority
                className="object-cover object-[center_top]"
              />
            </div>
          </motion.div>

          <motion.div
            className="md:w-2/3 text-center md:text-left"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
              {translations.about.title}
            </h1>
            <p className="text-muted-background md:text-lg mb-6">
              {profile?.description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline">Frontend Developer</Badge>
              <Badge variant="outline">UI/UX Design</Badge>
              <Badge variant="outline">Modern Web Applications</Badge>
            </div>
          </motion.div>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <div className="flex justify-center w-full mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="skills" className="flex-1">
                {translations.about.skills}
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex-1">
                {translations.about.experience}
              </TabsTrigger>
              <TabsTrigger value="education" className="flex-1">
                {translations.about.education}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="skills" className="mt-6">
            <div className="mb-8">
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills], catIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-2xl font-bold">
                        {category === "frontend"
                          ? translations.about.frontend
                          : category === "backend"
                          ? translations.about.backend
                          : translations.about.tools}
                      </h3>
                      <div className="h-[2px] flex-1 bg-primary/20 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          className="group relative flex flex-col items-center p-5 rounded-xl bg-card hover:bg-card/80 border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden text-center"
                          whileHover={{
                            boxShadow:
                              "0 10px 25px -5px rgba(var(--primary), 0.25)",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative mb-4 z-10">
                            <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background/90 backdrop-blur-sm shadow-inner border border-border/50 group-hover:border-primary/30 transition-all">
                              <StackIcon
                                name={skill.icon}
                                className="w-7 h-7 text-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110"
                              />
                            </div>
                          </div>

                          <h4 className="font-medium mt-1 text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </h4>

                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <motion.div
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              {experiences.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold">{exp.position}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-muted-foreground">{exp.company}</p>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.location}
                    </p>
                    <ul className="text-sm list-disc list-inside mt-4 space-y-2">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <motion.div
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              {education.map((edu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <Badge variant="outline">{edu.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {edu.location}
                    </p>
                    <ul className="text-sm list-disc list-inside mt-4 space-y-2">
                      {edu.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

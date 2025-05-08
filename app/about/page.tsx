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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-24 px-4 md:px-6">
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
              <Badge variant="outline">3D Web Specialist</Badge>
              <Badge variant="outline">UI/UX Enthusiast</Badge>
            </div>
          </motion.div>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">
              {translations.about.skills}
            </TabsTrigger>
            <TabsTrigger value="experience">
              {translations.about.experience}
            </TabsTrigger>
            <TabsTrigger value="education">
              {translations.about.education}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills]) => (
                  <Card
                    key={category}
                    className="hover:shadow-md transition-all duration-300 hover:border-primary/30"
                  >
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-4">
                        {category === "frontend"
                          ? translations.about.frontend
                          : category === "backend"
                            ? translations.about.backend
                            : translations.about.tools}
                      </h3>
                      <div className="flex flex-col space-y-2">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.name}
                            className="relative overflow-hidden group"
                          >
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg"
                              style={{
                                width: `${(skill.level / 5) * 100}%`,
                                transition: "all 0.5s ease",
                              }}
                            ></div>
                            <div className="relative z-10 p-4 border border-border/50 rounded-lg backdrop-blur-sm group-hover:border-primary/50 transition-all">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {skill.icon !== "" ? (
                                    <div className="relative">
                                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                      <div className="relative bg-background p-2 rounded-full">
                                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-background">
                                          <StackIcon
                                            name={skill.icon}
                                            className="w-5 h-5 text-primary"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-background"></div>
                                  )}
                                  <span className="font-medium text-sm  text-foreground">
                                    {skill.name}
                                  </span>
                                </div>

                                <div className="flex items-center">
                                  <div className="relative h-8 w-8">
                                    <svg
                                      viewBox="0 0 36 36"
                                      className="h-8 w-8 stroke-primary/30"
                                    >
                                      <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <svg
                                      viewBox="0 0 36 36"
                                      className="absolute inset-0 h-8 w-8 stroke-primary"
                                    >
                                      <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="100"
                                        strokeDashoffset={
                                          100 - (skill.level / 5) * 100
                                        }
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                      {skill.level}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </motion.div>
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

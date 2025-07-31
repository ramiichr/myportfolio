import { PrismaClient } from "@prisma/client";
import { portfolioData } from "@/data/portfolio-data";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    // Profile queries
    profile: async (_: any, { language }: { language: string }) => {
      return await prisma.profile.findUnique({
        where: { language },
      });
    },

    profiles: async () => {
      return await prisma.profile.findMany({
        orderBy: { language: "asc" },
      });
    },

    // Project queries
    projects: async (_: any, { language }: { language: string }) => {
      const projects = await prisma.project.findMany({
        where: { language },
        orderBy: { order: "asc" },
      });
      return projects.map((project) => ({
        ...project,
        tags: JSON.parse(project.tags),
      }));
    },

    project: async (_: any, { id }: { id: string }) => {
      const project = await prisma.project.findUnique({
        where: { id },
      });
      if (!project) return null;
      return {
        ...project,
        tags: JSON.parse(project.tags),
      };
    },

    projectsByProjectId: async (
      _: any,
      { projectId }: { projectId: string }
    ) => {
      const projects = await prisma.project.findMany({
        where: { projectId },
        orderBy: { language: "asc" },
      });
      return projects.map((project) => ({
        ...project,
        tags: JSON.parse(project.tags),
      }));
    },

    // Skill queries
    skills: async () => {
      return await prisma.skill.findMany({
        orderBy: { order: "asc" },
      });
    },

    skill: async (_: any, { id }: { id: string }) => {
      return await prisma.skill.findUnique({
        where: { id },
      });
    },

    // Experience queries
    experiences: async (_: any, { language }: { language: string }) => {
      const experiences = await prisma.experience.findMany({
        where: { language },
        orderBy: { order: "asc" },
      });
      return experiences.map((experience) => ({
        ...experience,
        description: JSON.parse(experience.description),
      }));
    },

    experience: async (_: any, { id }: { id: string }) => {
      const experience = await prisma.experience.findUnique({
        where: { id },
      });
      if (!experience) return null;
      return {
        ...experience,
        description: JSON.parse(experience.description),
      };
    },

    experiencesByExperienceId: async (
      _: any,
      { experienceId }: { experienceId: string }
    ) => {
      const experiences = await prisma.experience.findMany({
        where: { experienceId },
        orderBy: { language: "asc" },
      });
      return experiences.map((experience) => ({
        ...experience,
        description: JSON.parse(experience.description),
      }));
    },

    // Education queries
    educations: async (_: any, { language }: { language: string }) => {
      const educations = await prisma.education.findMany({
        where: { language },
        orderBy: { order: "asc" },
      });
      return educations.map((education) => ({
        ...education,
        description: JSON.parse(education.description),
      }));
    },

    education: async (_: any, { id }: { id: string }) => {
      const education = await prisma.education.findUnique({
        where: { id },
      });
      if (!education) return null;
      return {
        ...education,
        description: JSON.parse(education.description),
      };
    },

    educationsByEducationId: async (
      _: any,
      { educationId }: { educationId: string }
    ) => {
      const educations = await prisma.education.findMany({
        where: { educationId },
        orderBy: { language: "asc" },
      });
      return educations.map((education) => ({
        ...education,
        description: JSON.parse(education.description),
      }));
    },

    // Combined portfolio data query
    portfolioData: async (_: any, { language }: { language: string }) => {
      const [profile, projects, skills, experiences, education] =
        await Promise.all([
          prisma.profile.findUnique({ where: { language } }),
          prisma.project.findMany({
            where: { language },
            orderBy: { order: "asc" },
          }),
          prisma.skill.findMany({ orderBy: { order: "asc" } }),
          prisma.experience.findMany({
            where: { language },
            orderBy: { order: "asc" },
          }),
          prisma.education.findMany({
            where: { language },
            orderBy: { order: "asc" },
          }),
        ]);

      return {
        profile,
        projects: projects.map((project) => ({
          ...project,
          tags: JSON.parse(project.tags),
        })),
        skills,
        experiences: experiences.map((experience) => ({
          ...experience,
          description: JSON.parse(experience.description),
        })),
        education: education.map((edu) => ({
          ...edu,
          description: JSON.parse(edu.description),
        })),
      };
    },
  },

  Mutation: {
    // Profile mutations
    createProfile: async (_: any, { input }: { input: any }) => {
      return await prisma.profile.create({
        data: input,
      });
    },

    updateProfile: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      return await prisma.profile.update({
        where: { id },
        data: input,
      });
    },

    deleteProfile: async (_: any, { id }: { id: string }) => {
      await prisma.profile.delete({
        where: { id },
      });
      return true;
    },

    // Project mutations
    createProject: async (_: any, { input }: { input: any }) => {
      const data = {
        ...input,
        tags: JSON.stringify(input.tags),
      };
      const project = await prisma.project.create({
        data,
      });
      return {
        ...project,
        tags: JSON.parse(project.tags),
      };
    },

    updateProject: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const data = {
        ...input,
        tags: JSON.stringify(input.tags),
      };
      const project = await prisma.project.update({
        where: { id },
        data,
      });
      return {
        ...project,
        tags: JSON.parse(project.tags),
      };
    },

    deleteProject: async (_: any, { id }: { id: string }) => {
      await prisma.project.delete({
        where: { id },
      });
      return true;
    },

    // Skill mutations
    createSkill: async (_: any, { input }: { input: any }) => {
      return await prisma.skill.create({
        data: input,
      });
    },

    updateSkill: async (_: any, { id, input }: { id: string; input: any }) => {
      return await prisma.skill.update({
        where: { id },
        data: input,
      });
    },

    deleteSkill: async (_: any, { id }: { id: string }) => {
      await prisma.skill.delete({
        where: { id },
      });
      return true;
    },

    // Experience mutations
    createExperience: async (_: any, { input }: { input: any }) => {
      const data = {
        ...input,
        description: JSON.stringify(input.description),
      };
      const experience = await prisma.experience.create({
        data,
      });
      return {
        ...experience,
        description: JSON.parse(experience.description),
      };
    },

    updateExperience: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const data = {
        ...input,
        description: JSON.stringify(input.description),
      };
      const experience = await prisma.experience.update({
        where: { id },
        data,
      });
      return {
        ...experience,
        description: JSON.parse(experience.description),
      };
    },

    deleteExperience: async (_: any, { id }: { id: string }) => {
      await prisma.experience.delete({
        where: { id },
      });
      return true;
    },

    // Education mutations
    createEducation: async (_: any, { input }: { input: any }) => {
      const data = {
        ...input,
        description: JSON.stringify(input.description),
      };
      const education = await prisma.education.create({
        data,
      });
      return {
        ...education,
        description: JSON.parse(education.description),
      };
    },

    updateEducation: async (
      _: any,
      { id, input }: { id: string; input: any }
    ) => {
      const data = {
        ...input,
        description: JSON.stringify(input.description),
      };
      const education = await prisma.education.update({
        where: { id },
        data,
      });
      return {
        ...education,
        description: JSON.parse(education.description),
      };
    },

    deleteEducation: async (_: any, { id }: { id: string }) => {
      await prisma.education.delete({
        where: { id },
      });
      return true;
    },

    // Seed database with existing data
    seedDatabase: async () => {
      try {
        // Clear existing data
        await prisma.education.deleteMany();
        await prisma.experience.deleteMany();
        await prisma.project.deleteMany();
        await prisma.skill.deleteMany();
        await prisma.profile.deleteMany();

        // Seed profiles
        for (const [lang, profile] of Object.entries(portfolioData.profile)) {
          await prisma.profile.create({
            data: {
              language: lang,
              name: profile.name,
              title: profile.title,
              description: profile.description,
              email: profile.email,
              phone: profile.phone,
              location: profile.location,
              github: profile.social.github,
              linkedin: profile.social.linkedin,
              twitter: profile.social.twitter,
            },
          });
        }

        // Seed skills
        for (const [index, skill] of portfolioData.skills.entries()) {
          await prisma.skill.create({
            data: {
              name: skill.name,
              icon: skill.icon,
              category: skill.category,
              order: index,
            },
          });
        }

        // Seed projects
        for (const [lang, projects] of Object.entries(portfolioData.projects)) {
          for (const [index, project] of projects.entries()) {
            await prisma.project.create({
              data: {
                language: lang,
                projectId: project.id,
                title: project.title,
                description: project.description,
                image: project.image,
                tags: JSON.stringify(project.tags),
                link: project.link,
                github: project.github,
                category: project.category,
                featured: project.featured || false,
                order: index,
              },
            });
          }
        }

        // Seed experiences
        for (const [lang, experiences] of Object.entries(
          portfolioData.experiences
        )) {
          for (const [index, experience] of experiences.entries()) {
            await prisma.experience.create({
              data: {
                language: lang,
                experienceId: `exp-${index}`,
                position: experience.position,
                company: experience.company,
                period: experience.period,
                location: experience.location,
                description: JSON.stringify(experience.description),
                order: index,
              },
            });
          }
        }

        // Seed education
        for (const [lang, educations] of Object.entries(
          portfolioData.education
        )) {
          for (const [index, education] of educations.entries()) {
            await prisma.education.create({
              data: {
                language: lang,
                educationId: `edu-${index}`,
                degree: education.degree,
                institution: education.institution,
                period: education.period,
                location: education.location,
                description: JSON.stringify(education.description),
                order: index,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Seeding error:", error);
        return false;
      }
    },
  },
};

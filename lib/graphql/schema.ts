import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Profile {
    id: String!
    language: String!
    name: String!
    title: String!
    description: String!
    email: String!
    phone: String!
    location: String!
    github: String!
    linkedin: String!
    twitter: String!
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    id: String!
    language: String!
    projectId: String!
    title: String!
    description: String!
    image: String!
    tags: [String!]!
    link: String!
    github: String!
    category: String!
    featured: Boolean!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Skill {
    id: String!
    name: String!
    icon: String!
    category: String!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Experience {
    id: String!
    language: String!
    experienceId: String!
    position: String!
    company: String!
    period: String!
    location: String!
    description: [String!]!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Education {
    id: String!
    language: String!
    educationId: String!
    degree: String!
    institution: String!
    period: String!
    location: String!
    description: [String!]!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ProfileInput {
    language: String!
    name: String!
    title: String!
    description: String!
    email: String!
    phone: String!
    location: String!
    github: String!
    linkedin: String!
    twitter: String!
  }

  input ProjectInput {
    language: String!
    projectId: String!
    title: String!
    description: String!
    image: String!
    tags: [String!]!
    link: String!
    github: String!
    category: String!
    featured: Boolean = false
    order: Int = 0
  }

  input SkillInput {
    name: String!
    icon: String!
    category: String!
    order: Int = 0
  }

  input ExperienceInput {
    language: String!
    experienceId: String!
    position: String!
    company: String!
    period: String!
    location: String!
    description: [String!]!
    order: Int = 0
  }

  input EducationInput {
    language: String!
    educationId: String!
    degree: String!
    institution: String!
    period: String!
    location: String!
    description: [String!]!
    order: Int = 0
  }

  type Query {
    # Profile queries
    profile(language: String!): Profile
    profiles: [Profile!]!

    # Project queries
    projects(language: String!): [Project!]!
    project(id: String!): Project
    projectsByProjectId(projectId: String!): [Project!]!

    # Skill queries
    skills: [Skill!]!
    skill(id: String!): Skill

    # Experience queries
    experiences(language: String!): [Experience!]!
    experience(id: String!): Experience
    experiencesByExperienceId(experienceId: String!): [Experience!]!

    # Education queries
    educations(language: String!): [Education!]!
    education(id: String!): Education
    educationsByEducationId(educationId: String!): [Education!]!

    # Combined portfolio data query
    portfolioData(language: String!): PortfolioData!
  }

  type Mutation {
    # Profile mutations
    createProfile(input: ProfileInput!): Profile!
    updateProfile(id: String!, input: ProfileInput!): Profile!
    deleteProfile(id: String!): Boolean!

    # Project mutations
    createProject(input: ProjectInput!): Project!
    updateProject(id: String!, input: ProjectInput!): Project!
    deleteProject(id: String!): Boolean!

    # Skill mutations
    createSkill(input: SkillInput!): Skill!
    updateSkill(id: String!, input: SkillInput!): Skill!
    deleteSkill(id: String!): Boolean!

    # Experience mutations
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: String!, input: ExperienceInput!): Experience!
    deleteExperience(id: String!): Boolean!

    # Education mutations
    createEducation(input: EducationInput!): Education!
    updateEducation(id: String!, input: EducationInput!): Education!
    deleteEducation(id: String!): Boolean!

    # Bulk operations
    seedDatabase: Boolean!
  }

  type PortfolioData {
    profile: Profile
    projects: [Project!]!
    skills: [Skill!]!
    experiences: [Experience!]!
    education: [Education!]!
  }
`;

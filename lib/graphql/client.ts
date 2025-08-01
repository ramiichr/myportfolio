import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

// GraphQL queries
import { gql } from "@apollo/client";

export const GET_PORTFOLIO_DATA = gql`
  query GetPortfolioData($language: String!) {
    portfolioData(language: $language) {
      profile {
        id
        name
        title
        description
        email
        phone
        location
        github
        linkedin
        twitter
      }
      projects {
        id
        projectId
        title
        description
        image
        tags
        link
        github
        category
        featured
        order
      }
      skills {
        id
        name
        icon
        category
        order
      }
      experiences {
        id
        experienceId
        position
        company
        period
        location
        description
        order
      }
      education {
        id
        educationId
        degree
        institution
        period
        location
        description
        order
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($language: String!) {
    projects(language: $language) {
      id
      projectId
      title
      description
      image
      tags
      link
      github
      category
      featured
      order
    }
  }
`;

export const GET_SKILLS = gql`
  query GetSkills {
    skills {
      id
      name
      icon
      category
      order
    }
  }
`;

export const GET_EXPERIENCES = gql`
  query GetExperiences($language: String!) {
    experiences(language: $language) {
      id
      experienceId
      position
      company
      period
      location
      description
      order
    }
  }
`;

export const GET_EDUCATION = gql`
  query GetEducation($language: String!) {
    educations(language: $language) {
      id
      educationId
      degree
      institution
      period
      location
      description
      order
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($language: String!) {
    profile(language: $language) {
      id
      name
      title
      description
      email
      phone
      location
      github
      linkedin
      twitter
    }
  }
`;

// Mutations
export const SEED_DATABASE = gql`
  mutation SeedDatabase {
    seedDatabase
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      projectId
      title
      description
      image
      tags
      link
      github
      category
      featured
      order
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: String!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      projectId
      title
      description
      image
      tags
      link
      github
      category
      featured
      order
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id)
  }
`;

export const CREATE_SKILL = gql`
  mutation CreateSkill($input: SkillInput!) {
    createSkill(input: $input) {
      id
      name
      icon
      category
      order
    }
  }
`;

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($id: String!, $input: SkillInput!) {
    updateSkill(id: $id, input: $input) {
      id
      name
      icon
      category
      order
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation DeleteSkill($id: String!) {
    deleteSkill(id: $id)
  }
`;

// Experience mutations
export const CREATE_EXPERIENCE = gql`
  mutation CreateExperience($input: ExperienceInput!) {
    createExperience(input: $input) {
      id
      experienceId
      position
      company
      period
      location
      description
      order
    }
  }
`;

export const UPDATE_EXPERIENCE = gql`
  mutation UpdateExperience($id: String!, $input: ExperienceInput!) {
    updateExperience(id: $id, input: $input) {
      id
      experienceId
      position
      company
      period
      location
      description
      order
    }
  }
`;

export const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: String!) {
    deleteExperience(id: $id)
  }
`;

// Education mutations
export const CREATE_EDUCATION = gql`
  mutation CreateEducation($input: EducationInput!) {
    createEducation(input: $input) {
      id
      educationId
      degree
      institution
      period
      location
      description
      order
    }
  }
`;

export const UPDATE_EDUCATION = gql`
  mutation UpdateEducation($id: String!, $input: EducationInput!) {
    updateEducation(id: $id, input: $input) {
      id
      educationId
      degree
      institution
      period
      location
      description
      order
    }
  }
`;

export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($id: String!) {
    deleteEducation(id: $id)
  }
`;

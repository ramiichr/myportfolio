import type { Profile, Project, Skill, Experience, Education } from "@/types";

// Base URL for API calls
const API_BASE_URL = "/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred while fetching data");
  }
  return response.json() as Promise<T>;
}

// Fetch profile data
export async function getProfile(lang: string): Promise<Profile> {
  const response = await fetch(`${API_BASE_URL}/profile?lang=${lang}`);
  return handleResponse<Profile>(response);
}

// Fetch projects data with optional filters
export async function getProjects(
  lang: string,
  category?: string,
  featured?: boolean
): Promise<Project[]> {
  let url = `${API_BASE_URL}/projects?lang=${lang}`;

  if (category && category !== "all") {
    url += `&category=${category}`;
  }

  if (featured) {
    url += "&featured=true";
  }

  const response = await fetch(url);
  return handleResponse<Project[]>(response);
}

// Fetch skills data with optional category filter
export async function getSkills(category?: string): Promise<Skill[]> {
  let url = `${API_BASE_URL}/skills`;

  if (category) {
    url += `?category=${category}`;
  }

  const response = await fetch(url);
  return handleResponse<Skill[]>(response);
}

// Fetch experiences data
export async function getExperiences(lang: string): Promise<Experience[]> {
  const response = await fetch(`${API_BASE_URL}/experiences?lang=${lang}`);
  return handleResponse<Experience[]>(response);
}

// Fetch education data
export async function getEducation(lang: string): Promise<Education[]> {
  const response = await fetch(`${API_BASE_URL}/education?lang=${lang}`);
  return handleResponse<Education[]>(response);
}

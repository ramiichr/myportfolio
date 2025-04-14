import type { Profile, Project, Skill, Experience, Education } from "@/types";

// Base URL for API calls
const API_BASE_URL = "/api";

/**
 * Helper function to handle API responses with improved error handling
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(
        error.message || `Error ${response.status}: ${response.statusText}`
      );
    } catch (e) {
      // If parsing JSON fails, throw with status code
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  return response.json() as Promise<T>;
}

/**
 * Helper function to build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params: Record<string, string | boolean | undefined>
): string {
  const url = new URL(`${API_BASE_URL}/${endpoint}`, window.location.origin);

  // Add all defined parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Fetch profile data
 */
export async function getProfile(lang: string): Promise<Profile> {
  const url = buildUrl("profile", { lang });
  const response = await fetch(url);
  return handleResponse<Profile>(response);
}

/**
 * Fetch projects data with optional filters
 */
export async function getProjects(
  lang: string,
  category?: string,
  featured?: boolean
): Promise<Project[]> {
  const params: Record<string, string | boolean | undefined> = {
    lang,
    category: category !== "all" ? category : undefined,
    featured,
  };

  const url = buildUrl("projects", params);
  const response = await fetch(url);
  return handleResponse<Project[]>(response);
}

/**
 * Fetch skills data with optional category filter
 */
export async function getSkills(category?: string): Promise<Skill[]> {
  const url = buildUrl("skills", { category });
  const response = await fetch(url);
  return handleResponse<Skill[]>(response);
}

/**
 * Fetch experiences data
 */
export async function getExperiences(lang: string): Promise<Experience[]> {
  const url = buildUrl("experiences", { lang });
  const response = await fetch(url);
  return handleResponse<Experience[]>(response);
}

/**
 * Fetch education data
 */
export async function getEducation(lang: string): Promise<Education[]> {
  const url = buildUrl("education", { lang });
  const response = await fetch(url);
  return handleResponse<Education[]>(response);
}

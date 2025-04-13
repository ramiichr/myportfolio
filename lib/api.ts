import type {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Visitor,
  ClickEvent,
} from "@/types";

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

// Track visitor
export async function trackVisitor(path?: string): Promise<void> {
  // Always track in production, and in development if explicitly enabled
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_TRACKING === "true"
  ) {
    try {
      // Add a cache-busting parameter to prevent caching
      const timestamp = new Date().getTime();

      // Prepare the request body with the path if provided
      const body: Record<string, string> = {};
      if (path) {
        body.path = path;
      }

      const response = await fetch(
        `${API_BASE_URL}/track-visitor?t=${timestamp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
          // Make sure the request isn't cached
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Visitor tracking failed:", response.status, errorData);
        throw new Error(`Tracking failed with status ${response.status}`);
      }
    } catch (error) {
      // Log the error but don't disrupt user experience
      console.error("Failed to track visitor:", error);
      throw error; // Re-throw to allow the caller to handle it
    }
  }
}

// Track click event
export async function trackClickEvent(clickData: {
  elementId: string;
  elementType: string;
  elementText: string;
  elementPath: string;
  currentPath: string;
  x: number;
  y: number;
}): Promise<void> {
  // Always track in production, and in development if explicitly enabled
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_TRACKING === "true"
  ) {
    try {
      // Add a cache-busting parameter to prevent caching
      const timestamp = new Date().getTime();

      const response = await fetch(
        `${API_BASE_URL}/track-click?t=${timestamp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clickData),
          // Make sure the request isn't cached
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Click event tracking failed:",
          response.status,
          errorData
        );
        throw new Error(`Click tracking failed with status ${response.status}`);
      }
    } catch (error) {
      // Log the error but don't disrupt user experience
      console.error("Failed to track click event:", error);
      throw error; // Re-throw to allow the caller to handle it
    }
  }
}

// Fetch visitor data (admin only)
export async function getVisitors(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<Visitor[]> {
  let url = `${API_BASE_URL}/admin/visitors`;
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  // Add a cache-busting parameter
  params.append("t", new Date().getTime().toString());

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Make sure the request isn't cached
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return handleResponse<Visitor[]>(response);
}

// Delete all visitors (admin only)
export async function deleteAllVisitors(token: string): Promise<void> {
  const url = `${API_BASE_URL}/admin/delete-visitors`;

  // Add a timestamp to prevent caching
  const timestamp = new Date().getTime();
  const urlWithTimestamp = `${url}?t=${timestamp}`;

  try {
    const response = await fetch(urlWithTimestamp, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Make sure the request isn't cached
      cache: "no-store",
    });

    const result = await handleResponse<any>(response);
    console.log("Server response for visitor deletion:", result);

    // Make a second request to verify deletion
    const verifyResponse = await fetch(
      `${API_BASE_URL}/admin/visitors?t=${timestamp + 1}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const visitors = await handleResponse<Visitor[]>(verifyResponse);
    console.log(
      `Verification: Server has ${visitors.length} visitors after deletion`
    );

    // Also check the deletion status
    await checkDeletionStatus(token);

    // Don't return anything since the function is declared to return void
  } catch (error) {
    console.error("Error during visitor deletion:", error);
    throw error;
  }
}

// Fetch click event data (admin only)
export async function getClickEvents(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<ClickEvent[]> {
  let url = `${API_BASE_URL}/admin/click-events`;
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  // Add a cache-busting parameter
  params.append("t", new Date().getTime().toString());

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Make sure the request isn't cached
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return handleResponse<ClickEvent[]>(response);
}

// Delete all click events (admin only)
export async function deleteAllClickEvents(token: string): Promise<void> {
  const url = `${API_BASE_URL}/admin/delete-click-events`;

  // Add a timestamp to prevent caching
  const timestamp = new Date().getTime();
  const urlWithTimestamp = `${url}?t=${timestamp}`;

  try {
    const response = await fetch(urlWithTimestamp, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Make sure the request isn't cached
      cache: "no-store",
    });

    const result = await handleResponse<any>(response);
    console.log("Server response for click event deletion:", result);

    // Don't return anything since the function is declared to return void
  } catch (error) {
    console.error("Error during click event deletion:", error);
    throw error;
  }
}

// Check the deletion status on the server
export async function checkDeletionStatus(
  token: string
): Promise<{ isDeleted: boolean; cacheSize: number; timestamp: string }> {
  const timestamp = new Date().getTime();
  const url = `${API_BASE_URL}/admin/check-deletion?t=${timestamp}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await handleResponse<{
    isDeleted: boolean;
    cacheSize: number;
    timestamp: string;
  }>(response);
  console.log("Deletion status:", result);
  return result;
}

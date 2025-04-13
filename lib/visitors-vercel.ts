import { v4 as uuidv4 } from "uuid";
import type { Visitor } from "@/types";

// In-memory cache for development
let visitorCache: Visitor[] = [];

// Add a new visitor
export async function addVisitor(
  visitorData: Omit<Visitor, "id">
): Promise<Visitor> {
  const newVisitor: Visitor = {
    id: uuidv4(),
    ...visitorData,
  };

  // Log the visitor data for debugging
  console.log("Adding visitor:", JSON.stringify(newVisitor, null, 2));

  try {
    // In production, we'll use localStorage in the browser to store visitor data
    // This is a temporary solution until we implement a proper database
    if (typeof window !== "undefined") {
      // We're on the client side
      try {
        // Get existing visitors from localStorage
        const existingVisitorsStr =
          localStorage.getItem("portfolio_visitors") || "[]";
        const existingVisitors = JSON.parse(existingVisitorsStr) as Visitor[];

        // Add the new visitor
        existingVisitors.push(newVisitor);

        // Store back in localStorage (limited to recent visitors to avoid storage limits)
        const recentVisitors = existingVisitors.slice(-100); // Keep only the last 100 visitors
        localStorage.setItem(
          "portfolio_visitors",
          JSON.stringify(recentVisitors)
        );
      } catch (error) {
        console.error("Error storing visitor in localStorage:", error);
      }
    } else {
      // We're on the server side
      // In development, use the in-memory cache
      visitorCache.push(newVisitor);

      // Keep only the last 1000 visitors in memory
      if (visitorCache.length > 1000) {
        visitorCache = visitorCache.slice(-1000);
      }
    }

    return newVisitor;
  } catch (error) {
    console.error("Error saving visitor:", error);
    throw new Error("Failed to save visitor data");
  }
}

// Get all visitors
export async function getVisitors(): Promise<Visitor[]> {
  try {
    if (typeof window !== "undefined") {
      // We're on the client side
      try {
        const visitorsStr = localStorage.getItem("portfolio_visitors") || "[]";
        return JSON.parse(visitorsStr) as Visitor[];
      } catch (error) {
        console.error("Error retrieving visitors from localStorage:", error);
        return [];
      }
    } else {
      // We're on the server side
      // In development, use the in-memory cache
      return [...visitorCache];
    }
  } catch (error) {
    console.error("Error retrieving visitors:", error);
    return [];
  }
}

// Get visitors filtered by date range
export async function getVisitorsByDateRange(
  startDate?: string,
  endDate?: string
): Promise<Visitor[]> {
  const visitors = await getVisitors();

  if (!startDate && !endDate) {
    return visitors;
  }

  return visitors.filter((visitor) => {
    const visitorDate = new Date(visitor.timestamp);

    if (startDate && endDate) {
      return (
        visitorDate >= new Date(startDate) && visitorDate <= new Date(endDate)
      );
    }

    if (startDate) {
      return visitorDate >= new Date(startDate);
    }

    if (endDate) {
      return visitorDate <= new Date(endDate);
    }

    return true;
  });
}

// Validate API token
export function validateToken(token: string | null): boolean {
  if (!token) return false;

  const validToken = process.env.VISITOR_API_TOKEN;
  return token === validToken;
}

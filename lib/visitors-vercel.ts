import { v4 as uuidv4 } from "uuid";
import type { Visitor } from "@/types";

// In-memory cache for development
let visitorCache: Visitor[] = [];

// Access the global flag for tracking if visitors have been deleted
declare global {
  var visitorsDeleted: boolean;
}

// Initialize the global variable if it doesn't exist
if (typeof global.visitorsDeleted === "undefined") {
  global.visitorsDeleted = false;
}

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
        // Check if visitors have been explicitly deleted
        const deletedFlag = localStorage.getItem("portfolio_visitors_deleted");
        if (deletedFlag === "true") {
          // If visitors were explicitly deleted, reset the flag when adding a new visitor
          console.log("Resetting deletion flag when adding new visitor");
          localStorage.setItem("portfolio_visitors_deleted", "false");
        }

        // Get existing visitors from localStorage
        const existingVisitorsStr =
          localStorage.getItem("portfolio_visitors") || "[]";
        const existingVisitors = JSON.parse(existingVisitorsStr) as Visitor[];

        // Always add the new visitor (we're allowing duplicates as requested)
        existingVisitors.push(newVisitor);
        console.log(`Added visitor for path: ${newVisitor.path}`);

        // Store back in localStorage (limited to recent visitors to avoid storage limits)
        const recentVisitors = existingVisitors.slice(-500); // Keep up to 500 visitors for better data retention

        // Store in both the regular key and a persistent backup key
        localStorage.setItem(
          "portfolio_visitors",
          JSON.stringify(recentVisitors)
        );

        // Also store in a persistent backup that won't be automatically cleared
        // This serves as an automatic backup in case the main list is lost
        localStorage.setItem(
          "portfolio_visitors_persistent",
          JSON.stringify(recentVisitors)
        );
      } catch (error) {
        console.error("Error storing visitor in localStorage:", error);
      }
    } else {
      // We're on the server side
      // Check if visitors have been deleted
      if (global.visitorsDeleted) {
        // Reset the deleted flag when a new visitor is added
        global.visitorsDeleted = false;
        // Clear the cache before adding the new visitor
        visitorCache = [];
      }

      // Always add the new visitor to the in-memory cache (allowing duplicates)
      visitorCache.push(newVisitor);
      console.log(`Added server-side visitor for path: ${newVisitor.path}`);

      // Keep only the last 1000 visitors in memory
      if (visitorCache.length > 1000) {
        visitorCache = visitorCache.slice(-1000);
      }

      // Log the current visitor count for debugging
      console.log(
        `Server-side visitor cache now has ${visitorCache.length} visitors`
      );
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
        // Check if visitors have been explicitly deleted
        const deletedFlag = localStorage.getItem("portfolio_visitors_deleted");
        if (deletedFlag === "true") {
          console.log(
            "Visitors were explicitly deleted, returning empty array"
          );

          // Double-check that all visitor data is cleared
          localStorage.removeItem("portfolio_visitors");
          localStorage.removeItem("portfolio_visitors_backup");
          localStorage.removeItem("portfolio_visitors_persistent");

          // Set empty arrays for safety
          localStorage.setItem("portfolio_visitors", JSON.stringify([]));
          localStorage.setItem("portfolio_visitors_backup", JSON.stringify([]));
          localStorage.setItem(
            "portfolio_visitors_persistent",
            JSON.stringify([])
          );

          // If visitors were explicitly deleted, don't restore from any backup
          return [];
        }

        // First try to get from the main storage
        const visitorsStr = localStorage.getItem("portfolio_visitors");

        if (visitorsStr) {
          const visitors = JSON.parse(visitorsStr) as Visitor[];

          // If we have visitors in the main storage, return them (allowing duplicates)
          if (visitors && Array.isArray(visitors) && visitors.length > 0) {
            return visitors;
          }
        }

        // If main storage is empty or invalid, try to get from persistent backup
        // BUT only if visitors weren't explicitly deleted
        const persistentVisitorsStr = localStorage.getItem(
          "portfolio_visitors_persistent"
        );

        if (persistentVisitorsStr) {
          try {
            const persistentVisitors = JSON.parse(
              persistentVisitorsStr
            ) as Visitor[];

            // If we have visitors in the persistent backup, restore them to the main storage
            if (
              persistentVisitors &&
              Array.isArray(persistentVisitors) &&
              persistentVisitors.length > 0
            ) {
              // Restore the backup to the main storage (allowing duplicates)
              localStorage.setItem("portfolio_visitors", persistentVisitorsStr);
              console.log(
                `Restored ${persistentVisitors.length} visitors from persistent backup`
              );
              return persistentVisitors;
            }
          } catch (parseError) {
            console.error(
              "Error parsing persistent visitors storage:",
              parseError
            );
          }
        }

        // If both storages are empty, return an empty array
        return [];
      } catch (error) {
        console.error("Error retrieving visitors from localStorage:", error);
        return [];
      }
    } else {
      // We're on the server side
      // Check if visitors have been deleted using the global flag
      if (global.visitorsDeleted) {
        console.log(
          "Server-side visitors were explicitly deleted, returning empty array"
        );

        // Ensure the cache is cleared
        visitorCache = [];

        return [];
      }

      // In development, use the in-memory cache
      // Make a deep copy to prevent accidental modifications
      console.log(`Returning ${visitorCache.length} server-side visitors`);
      return [...visitorCache];
    }
  } catch (error) {
    console.error("Error retrieving visitors:", error);
    return [];
  }
}

// Helper function to deduplicate visitors by ID
function deduplicateVisitors(visitors: Visitor[]): Visitor[] {
  // Use a Map to keep only the latest entry for each visitor ID
  const visitorMap = new Map<string, Visitor>();

  // Process in reverse order so the most recent entry for each ID is kept
  // (assuming visitors are added chronologically)
  for (let i = visitors.length - 1; i >= 0; i--) {
    const visitor = visitors[i];
    if (visitor && visitor.id && !visitorMap.has(visitor.id)) {
      visitorMap.set(visitor.id, visitor);
    }
  }

  // Convert back to array and reverse to maintain chronological order
  return Array.from(visitorMap.values()).reverse();
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

// Clear the visitor cache (used when deleting all visitors)
export function clearVisitorCache(): void {
  // Clear the in-memory cache
  visitorCache = [];

  // Set the global deletion flag
  global.visitorsDeleted = true;

  console.log("Visitor cache cleared successfully");
}

// Get the current size of the visitor cache
export function getVisitorCacheSize(): number {
  return visitorCache.length;
}

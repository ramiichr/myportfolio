import { createClient } from "@vercel/redis";
import { VisitorData } from "@/types/visitor";

// Create Redis client
const redis = createClient({
  url: process.env.REDIS_URL,
  // The token is optional when using a connection URL that includes authentication
});

// Key for storing visitor data
const VISITORS_KEY = "visitors";

/**
 * Adds a new visitor to the Redis store
 */
export async function addVisitor(visitorData: VisitorData): Promise<void> {
  try {
    // Get existing visitors
    const visitors = await getVisitors();

    // Add new visitor
    visitors.push(visitorData);

    // Store back in Redis
    await redis.set(VISITORS_KEY, JSON.stringify(visitors));
  } catch (error: unknown) {
    console.error("Error adding visitor to Redis store:", error);
    throw error;
  }
}

/**
 * Gets all visitors from the Redis store
 */
export async function getVisitors(): Promise<VisitorData[]> {
  try {
    // Get visitors from Redis store
    const visitorsJson = await redis.get(VISITORS_KEY);

    // If no visitors yet, return empty array
    if (!visitorsJson) {
      return [];
    }

    // Parse and return visitors
    return JSON.parse(visitorsJson as string);
  } catch (error: unknown) {
    console.error("Error getting visitors from Redis store:", error);
    // Return empty array on error
    return [];
  }
}

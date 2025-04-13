import Redis from "ioredis";
import { VisitorData } from "@/types/visitor";

// Create Redis client
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null; // Will be null during build time when env vars aren't available

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
    if (redis) {
      await redis.set(VISITORS_KEY, JSON.stringify(visitors));
    } else {
      console.warn("Redis client not available, visitor data not stored");
      // In development, you might want to store to a local file instead
    }
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
    if (!redis) {
      console.warn("Redis client not available, returning empty visitor list");
      return [];
    }

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

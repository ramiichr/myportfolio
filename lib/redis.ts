import { Redis } from "@upstash/redis";

// Create Redis client
let redis: Redis;

// Initialize Redis client
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // For development without Redis, use a mock implementation
  redis = {
    get: async () => null,
    set: async () => null,
    incr: async () => 1,
    hgetall: async () => ({}),
    hset: async () => 1,
    hincrby: async () => 1,
    zrange: async () => [],
    zadd: async () => 1,
    lpush: async () => 1,
    ltrim: async () => 1,
    expire: async () => 1,
    sadd: async () => 1,
    scard: async () => 0,
    lrange: async () => [],
  } as unknown as Redis;

  if (process.env.NODE_ENV !== "production") {
    console.warn("Redis credentials not found. Using mock implementation.");
  }
}

export default redis;

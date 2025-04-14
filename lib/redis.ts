import { Redis } from "@upstash/redis";

/**
 * Type for the mock Redis implementation
 * This ensures our mock has all the methods we use
 */
type MockRedis = {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, options?: any) => Promise<any>;
  incr: (key: string) => Promise<number>;
  hgetall: (key: string) => Promise<Record<string, any>>;
  hset: (key: string, field: string, value: any) => Promise<number>;
  hincrby: (key: string, field: string, increment: number) => Promise<number>;
  zrange: (
    key: string,
    start: number,
    end: number,
    options?: any
  ) => Promise<any[]>;
  zadd: (key: string, score: number, member: string) => Promise<number>;
  lpush: (key: string, ...elements: any[]) => Promise<number>;
  ltrim: (key: string, start: number, end: number) => Promise<any>;
  expire: (key: string, seconds: number) => Promise<number>;
  sadd: (key: string, ...members: any[]) => Promise<number>;
  scard: (key: string) => Promise<number>;
  lrange: (key: string, start: number, end: number) => Promise<any[]>;
  llen: (key: string) => Promise<number>;
};

// Create Redis client
let redis: Redis;

// Initialize Redis client
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Use real Redis client when credentials are available
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // For development without Redis, use a mock implementation with proper typing
  const mockRedis: MockRedis = {
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
    llen: async () => 0,
  };

  redis = mockRedis as unknown as Redis;

  if (process.env.NODE_ENV !== "production") {
    console.warn("Redis credentials not found. Using mock implementation.");
  }
}

export default redis;

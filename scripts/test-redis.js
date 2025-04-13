// Test script for Redis connection
require("dotenv").config({ path: ".env.local" });

const Redis = require("ioredis");

// Check if REDIS_URL is set
if (!process.env.REDIS_URL) {
  console.error("Error: REDIS_URL environment variable is not set");
  console.log(
    "Please make sure you have a .env.local file with REDIS_URL defined"
  );
  process.exit(1);
}

console.log("Connecting to Redis...");
const redis = new Redis(process.env.REDIS_URL);

redis
  .set("test", "Hello Redis")
  .then(() => {
    console.log("✅ Successfully connected to Redis");
    return redis.get("test");
  })
  .then((result) => {
    console.log("Test value:", result);
    console.log("Redis connection is working properly");
    redis.quit();
  })
  .catch((err) => {
    console.error("❌ Redis connection error:", err);
    console.log(
      "Please check your REDIS_URL and make sure your Redis instance is running"
    );
    process.exit(1);
  });

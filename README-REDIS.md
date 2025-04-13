# Setting Up Redis for Visitor Tracking

## Installation

To set up Redis for visitor tracking, we're using the `ioredis` package:

```bash
npm install ioredis
```

## Configuration

1. Make sure your `.env.local` file contains the Redis URL:

```
REDIS_URL=your_redis_url_from_vercel
```

2. The Redis client is configured in `lib/kv-storage.ts` to use this URL with the ioredis package.

## Deployment

When deploying to Vercel:

1. Make sure the `REDIS_URL` environment variable is set in your Vercel project settings
2. Set the `VISITOR_API_TOKEN` environment variable to a secure random string

## Local Development

For local development:

1. Copy `.env.example` to `.env.local`
2. Add your `REDIS_URL` from the Vercel dashboard
3. Set a secure random token for `VISITOR_API_TOKEN`
4. Run your development server: `npm run dev`

## Troubleshooting

If you encounter any issues:

1. Verify that the `ioredis` package is installed:

   ```bash
   npm list ioredis
   ```

2. Check that your Redis URL is correctly set in your environment variables

   ```bash
   echo $REDIS_URL
   ```

3. Make sure your Redis instance is active in the Vercel dashboard

4. Test your Redis connection:

   ```javascript
   // test-redis.js
   const Redis = require("ioredis");
   const redis = new Redis(process.env.REDIS_URL);

   redis
     .set("test", "Hello Redis")
     .then(() => {
       console.log("Successfully connected to Redis");
       return redis.get("test");
     })
     .then((result) => {
       console.log("Test value:", result);
       redis.quit();
     })
     .catch((err) => {
       console.error("Redis connection error:", err);
       process.exit(1);
     });
   ```

5. If you're still having issues, try using a different Redis client library like `redis` or `node-redis`

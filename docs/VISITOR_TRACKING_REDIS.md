# Visitor Tracking Setup with Redis

This project includes visitor tracking functionality that works both in development and when deployed to Vercel.

## How It Works

- In development: Visitor data is stored in a local JSON file (`/data/visitors.json`)
- In production: Visitor data is stored in Vercel Redis

## Setting Up Vercel Redis

To enable visitor tracking in production, you need to set up Vercel Redis:

1. Go to your Vercel dashboard and select your project
2. Navigate to the "Storage" tab
3. Find "Redis Database" and click "Connect"
4. Follow the prompts to create a new Redis database
5. Choose an appropriate region and plan
6. Click "Create"

After creating the Redis database, Vercel will automatically add the required environment variables to your project.

7. Set a secure random token for API access:

   ```
   vercel env add VISITOR_API_TOKEN
   ```

   Enter a secure random string when prompted.

8. Deploy your project:
   ```
   vercel --prod
   ```

## Local Development

For local development:

1. Copy `.env.local.example` to `.env.local`:

   ```
   cp .env.local.example .env.local
   ```

2. Fill in the Redis connection URL from your Vercel dashboard:

   - `REDIS_URL`

3. Set a secure random token for the `VISITOR_API_TOKEN` variable.

## Accessing Visitor Data

You can access visitor data through the API:

- GET `/api/track-visitor` - Returns all visitor data (requires authentication in production)

To authenticate, include the following header in your request:

```
Authorization: Bearer your_visitor_api_token
```

## Tracking New Visitors

The tracking happens automatically when users visit your site through the following mechanism:

1. A client-side component makes a POST request to `/api/track-visitor`
2. The API records the visitor's IP, user agent, and geolocation data
3. In development, this data is stored in a local JSON file
4. In production, this data is stored in Vercel Redis

## Security Considerations

- The visitor API endpoint is protected in production with a token
- IP addresses are only used for geolocation and are not shared with third parties
- Consider adding a privacy policy to your site explaining the data collection

## Troubleshooting Redis Connection

If you encounter issues connecting to Redis:

1. Verify that all environment variables are set correctly
2. Check that the Redis database is active in your Vercel dashboard
3. Ensure your Vercel project has the correct permissions to access the Redis database
4. Try redeploying your application after setting up Redis

## Redis Data Management

You can manage your Redis data directly from the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to the "Storage" tab
3. Select your Redis database
4. Use the interface to browse and manage your data

Remember that Redis data is persistent but not backed up by default. Consider implementing a backup strategy for important visitor data.

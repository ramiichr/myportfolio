# Setting Up Redis for Website Traffic Dashboard

This document explains how to set up Redis for the website traffic dashboard in production on Vercel.

## Prerequisites

- A Vercel account
- An Upstash account (for Redis)

## Steps to Set Up Redis on Vercel

### 1. Create an Upstash Redis Database

1. Go to [Upstash](https://upstash.com/) and sign up or log in
2. Create a new Redis database
   - Choose a name for your database (e.g., "portfolio-analytics")
   - Select a region closest to your users
   - Choose the free tier for starting out
3. Once created, go to the database details page
4. Find and copy the following credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your portfolio project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables:

   - `UPSTASH_REDIS_REST_URL`: Paste the URL from Upstash
   - `UPSTASH_REDIS_REST_TOKEN`: Paste the token from Upstash
   - `VISITOR_API_TOKEN`: Use the same token as in your .env.local file or generate a new secure random string
   - `NEXT_PUBLIC_ENABLE_TRACKING`: Set to "true" to enable tracking

5. Save the changes

### 3. Deploy Your Application

1. Commit and push your changes to your repository
2. Vercel will automatically deploy your application with the new environment variables

### 4. Access the Dashboard

1. Visit your deployed site at `/dashboard`
2. Enter your `VISITOR_API_TOKEN` when prompted
3. You should now see your website traffic analytics

## Local Development

For local development, you can:

1. Install Redis locally, or
2. Use the Upstash Redis database (recommended for consistency)

Add the following to your `.env.local` file:

```
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
VISITOR_API_TOKEN=your-secure-token
NEXT_PUBLIC_ENABLE_TRACKING=true
```

## Troubleshooting

- If you're not seeing any data in the dashboard, make sure tracking is enabled by setting `NEXT_PUBLIC_ENABLE_TRACKING=true`
- Verify that your Redis credentials are correct
- Check the browser console and server logs for any errors

## Security Considerations

- Never expose your Redis credentials in client-side code
- The `VISITOR_API_TOKEN` protects your analytics data from unauthorized access
- Consider implementing rate limiting for the tracking API to prevent abuse

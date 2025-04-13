# Visitor Tracking Setup

This project includes visitor tracking functionality that works both in development and when deployed to Vercel.

## How It Works

- In development: Visitor data is stored in a local JSON file (`/data/visitors.json`)
- In production: Visitor data is stored in Vercel KV (a Redis-based key-value store)

## Setting Up Vercel KV

To enable visitor tracking in production, you need to set up Vercel KV:

1. Make sure you have the Vercel CLI installed:

   ```
   npm i -g vercel
   ```

2. Link your project to Vercel (if not already done):

   ```
   vercel link
   ```

3. Add Vercel KV to your project:

   ```
   vercel kv add
   ```

   Follow the prompts to create a new KV database.

4. After creating the KV database, Vercel will automatically add the required environment variables to your project.

5. Set a secure random token for API access:

   ```
   vercel env add VISITOR_API_TOKEN
   ```

   Enter a secure random string when prompted.

6. Deploy your project:
   ```
   vercel --prod
   ```

## Local Development

For local development:

1. Copy `.env.local.example` to `.env.local`:

   ```
   cp .env.local.example .env.local
   ```

2. Fill in the KV connection details from your Vercel dashboard.

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
4. In production, this data is stored in Vercel KV

## Security Considerations

- The visitor API endpoint is protected in production with a token
- IP addresses are only used for geolocation and are not shared with third parties
- Consider adding a privacy policy to your site explaining the data collection

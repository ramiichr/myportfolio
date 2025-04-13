# Deploying Your Portfolio to Vercel

This guide will help you deploy your portfolio to Vercel with visitor tracking enabled.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended)
3. Your portfolio code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository to Vercel

The easiest way to deploy is directly from your Git repository:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure your project settings (the defaults should work fine)
5. Click "Deploy"

### 2. Set Up Vercel Redis for Visitor Tracking

To enable visitor tracking in production, you need to set up Vercel Redis:

1. Go to your project in the Vercel dashboard
2. Navigate to "Storage" tab
3. Click "Connect" next to Redis Database
4. Follow the prompts to create a new Redis database
5. Choose an appropriate region and plan
6. Click "Create"
7. Vercel will automatically add the required environment variables to your project

### 3. Set API Token for Visitor Data Access

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add a new environment variable:
   - Name: `VISITOR_API_TOKEN`
   - Value: [generate a secure random string]
4. Click "Save"

### 4. Redeploy Your Project

After setting up KV and environment variables, redeploy your project:

1. Go to the "Deployments" tab
2. Click "Redeploy" on your latest deployment

## Accessing Visitor Statistics

Once deployed, you can access your visitor statistics at:

```
https://your-domain.vercel.app/admin/visitors
```

You'll need to enter the API token you set in the environment variables to view the data.

## Local Development with Vercel Redis

To use Vercel Redis in local development:

1. Install Vercel CLI:

   ```
   npm i -g vercel
   ```

2. Link your project:

   ```
   vercel link
   ```

3. Pull environment variables:

   ```
   vercel env pull .env.local
   ```

   This will include your Redis connection details.

4. Start your development server:
   ```
   npm run dev
   ```

## Troubleshooting

- If visitor tracking isn't working, check the browser console for errors
- Verify that all environment variables are set correctly
- Make sure your Vercel Redis database is properly connected
- Check that your API routes are functioning by testing them directly
- If Redis connection fails, verify the connection details in your environment variables

For more detailed information about visitor tracking with Redis, see [VISITOR_TRACKING_REDIS.md](./VISITOR_TRACKING_REDIS.md).

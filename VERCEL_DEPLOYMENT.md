# Vercel Deployment Guide

This portfolio is configured to deploy on Vercel with PostgreSQL database support.

## 🚨 IMMEDIATE FIX FOR DEPLOYMENT FAILURE

**The deployment is failing because no PostgreSQL database is configured.** Follow these steps:

### Step 1: Set Up Vercel Postgres (5 minutes)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `myportfolio` project
3. Go to the **"Storage"** tab
4. Click **"Create Database"** → **"Postgres"**
5. Choose a database name (e.g., `myportfolio-db`)
6. Click **"Create"**

✅ Vercel will automatically add `DATABASE_URL` to your environment variables!

### Step 2: Redeploy
1. Go to the **"Deployments"** tab in your Vercel project
2. Click **"Redeploy"** on the latest deployment
3. Your app should now deploy successfully! 🎉

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Vercel Postgres, Supabase, or Neon)

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database" → "Postgres"
5. The `DATABASE_URL` will be automatically added to your environment variables

### Option 2: External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string (format: `postgresql://user:password@host:port/database`)
3. Add it to your Vercel environment variables as `DATABASE_URL`

### Option 3: Supabase (Free Alternative)
1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add it as `DATABASE_URL` in Vercel environment variables

## Environment Variables

Set these in your Vercel project settings:

### Required

- `DATABASE_URL`: PostgreSQL connection string (automatically set with Vercel Postgres)

### Optional

- `UPSTASH_REDIS_REST_URL`: Redis URL for caching
- `UPSTASH_REDIS_REST_TOKEN`: Redis token
- `RESEND_API_KEY`: For contact form emails
- `GITHUB_TOKEN`: For GitHub contributions graph

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Configure Database**: Set up Vercel Postgres (see immediate fix above)
3. **Deploy**: Vercel will automatically build and deploy your application

## Build Configuration

The project is configured with:

- Build command: `prisma generate && next build`
- Post-build: `prisma migrate deploy` (with fallback handling)
- Framework preset: Next.js

## Database Migration

On first deployment, Prisma will automatically run migrations using the `postbuild` script.

## Troubleshooting

### Common Issues:
- **"DATABASE_URL must start with postgresql://"**: Set up Vercel Postgres or add a valid PostgreSQL URL
- **"Migration failed"**: Ensure your database is accessible and the URL is correct
- **Build timeout**: Large database migrations might need optimization

### Debug Steps:
1. Check Vercel build logs for specific errors
2. Verify `DATABASE_URL` is set in environment variables
3. Test database connection from your local environment

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update `DATABASE_URL` with your local PostgreSQL connection
3. Run `pnpm db:migrate` to set up the database
4. Run `pnpm dev` to start development server

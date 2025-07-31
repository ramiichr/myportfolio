# Vercel Deployment Guide

This portfolio is configured to deploy on Vercel with PostgreSQL database support.

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
2. Get the connection string
3. Add it to your Vercel environment variables as `DATABASE_URL`

## Environment Variables

Set these in your Vercel project settings:

### Required

- `DATABASE_URL`: PostgreSQL connection string

### Optional

- `UPSTASH_REDIS_REST_URL`: Redis URL for caching
- `UPSTASH_REDIS_REST_TOKEN`: Redis token
- `RESEND_API_KEY`: For contact form emails
- `GITHUB_TOKEN`: For GitHub contributions graph

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Configure Environment Variables**: Add the required environment variables
3. **Deploy**: Vercel will automatically build and deploy your application

## Build Configuration

The project is already configured with:

- Build command: `prisma generate && next build`
- Post-build: `prisma migrate deploy`
- Framework preset: Next.js

## Database Migration

On first deployment, Prisma will automatically run migrations using the `postbuild` script.

## Troubleshooting

- **Database Connection**: Ensure your `DATABASE_URL` is correctly formatted
- **Build Errors**: Check the build logs in Vercel dashboard
- **Migration Issues**: Verify your database schema is accessible

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update `DATABASE_URL` with your local PostgreSQL connection
3. Run `pnpm db:migrate` to set up the database
4. Run `pnpm dev` to start development server

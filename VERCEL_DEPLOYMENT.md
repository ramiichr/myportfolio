# Vercel Deployment Guide

## Pre-deployment Setup

### 1. Database Setup

For production deployment on Vercel, you need a PostgreSQL database. Here are your options:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection string

#### Option B: External PostgreSQL (Railway, Supabase, etc.)
1. Create a PostgreSQL database on your preferred provider
2. Get the connection string

### 2. Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Required
DATABASE_URL="your_postgresql_connection_string"

# Optional (for features)
UPSTASH_REDIS_REST_URL="your_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_redis_token"
NEXT_PUBLIC_ENABLE_TRACKING="true"
RESEND_API_KEY="your_resend_api_key"
```

### 3. Deployment Steps

1. **Push your changes:**
   ```bash
   git add .
   git commit -m "fix: Configure for Vercel deployment with PostgreSQL"
   git push
   ```

2. **Trigger deployment on Vercel:**
   - Vercel will automatically deploy when you push to main
   - Or manually trigger from Vercel dashboard

3. **Run database migrations (first deployment only):**
   - Go to Vercel dashboard > Functions
   - Find your project's functions
   - You may need to run migrations manually via Vercel CLI or API

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Check DATABASE_URL is correct
   - Ensure database is accessible from Vercel's IP ranges

2. **Prisma Client Errors:**
   - Prisma Client should generate automatically
   - If not, check the build logs

3. **Build Failures:**
   - Check all environment variables are set
   - Verify database schema is valid

### Build Script Changes Made:

- Removed `postbuild` script that was causing issues
- Added `postinstall` script for Prisma generation
- Updated database provider to PostgreSQL

## Next Steps After Successful Deployment:

1. Test all API endpoints
2. Seed your database with initial data via `/api/seed`
3. Set up monitoring and error tracking
4. Configure any additional environment variables for production features

# Database Configuration Guide

This guide explains how to configure your database for both local development and production deployment on Vercel.

## Overview

- **Local Development**: SQLite (simple, no setup required)
- **Production (Vercel)**: PostgreSQL (Vercel Postgres)

## Local Development Setup

Your local environment is already configured to use SQLite:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

## Vercel Production Setup

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database**
3. Select **Postgres**
4. Name your database (e.g., `myportfolio-db`)
5. Choose your region
6. Click **Create**

### Step 2: Configure Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```bash
# Primary database URL (Vercel will auto-populate this)
DATABASE_URL=your_postgres_prisma_url

# Additional Postgres variables (auto-populated by Vercel)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
```

### Step 3: Update Schema for Production

For production deployment, you need to update the Prisma schema to use PostgreSQL:

1. Before deploying, temporarily change `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Or use our automated deployment script:
   ```bash
   bash scripts/setup-db.sh
   ```

### Step 4: Deploy to Vercel

The deployment process will automatically:

1. Switch to PostgreSQL provider
2. Generate Prisma client
3. Push database schema
4. Deploy your application

```bash
# Deploy via Git push or Vercel CLI
vercel --prod
```

## Database Commands

### Local Development (SQLite)

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Reset database
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Production (PostgreSQL)

```bash
# Push schema to production (use this instead of migrate for managed databases)
npm run db:push

# Generate client
npm run db:generate
```

## Environment Variables

### Local (.env)

```bash
DATABASE_URL="file:./dev.db"
```

### Production (Vercel)

```bash
DATABASE_URL="${POSTGRES_PRISMA_URL}"
POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?schema=public"
```

## Troubleshooting

### Common Issues

1. **Migration Issues**: Use `prisma db push` instead of `prisma migrate` for managed databases like Vercel Postgres.

2. **Connection Issues**: Ensure your Vercel environment variables are correctly set.

3. **Schema Validation**: Make sure you're using the correct provider (`postgresql` for production, `sqlite` for local).

### Migration from SQLite to PostgreSQL

If you need to migrate existing data:

1. Export data from SQLite:

   ```bash
   npx prisma db seed
   ```

2. Switch to PostgreSQL in production

3. Re-seed the production database through your API endpoints

## Database Schema Updates

When updating your schema:

1. Update `prisma/schema.prisma`
2. For local: Run `npm run db:migrate`
3. For production: Deploy to Vercel (auto-pushes schema)

## Security Notes

- Never commit production database URLs to version control
- Use environment variables for all sensitive data
- Regularly rotate database credentials
- Use connection pooling for better performance

## Performance Tips

- Use `POSTGRES_PRISMA_URL` for connection pooling
- Use `POSTGRES_URL_NON_POOLING` for migrations
- Implement proper indexing for frequently queried fields
- Use Prisma's query optimization features

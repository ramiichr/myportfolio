#!/bin/bash

# Build script for Vercel deployment with database handling

echo "🔄 Starting build process..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set - this may cause deployment issues"
    echo "ℹ️  Please set up a PostgreSQL database in Vercel"
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "🏗️  Building Next.js application..."
npm run build

# Try to deploy migrations (this will run in postbuild)
echo "✅ Build completed successfully!"

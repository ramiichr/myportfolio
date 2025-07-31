#!/bin/bash

# Deployment script for Vercel with database configuration

echo "🚀 Starting deployment process..."

# Check if we're in a Vercel environment
if [ "$VERCEL" = "1" ]; then
    echo "📦 Vercel environment detected"
    
    # Update Prisma schema for PostgreSQL in production
    echo "🔄 Updating Prisma schema for PostgreSQL..."
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
    
    # Use the Vercel Postgres URL
    if [ -n "$POSTGRES_PRISMA_URL" ]; then
        export DATABASE_URL="$POSTGRES_PRISMA_URL"
        echo "✅ Database URL set to Vercel Postgres"
    fi
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push database schema (creates tables if they don't exist)
    echo "📊 Pushing database schema..."
    npx prisma db push
    
else
    echo "🏠 Local environment detected - using SQLite"
    npx prisma generate
fi

echo "✅ Database configuration complete!"

#!/bin/bash

# Vercel Deployment Script
# This script handles the post-build setup for your portfolio

echo "🚀 Setting up database for production..."

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database with initial data
curl -X POST $VERCEL_URL/api/seed || echo "⚠️  Seeding will run after first deployment"

echo "✅ Database setup complete!"

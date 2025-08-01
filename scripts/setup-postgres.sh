#!/bin/bash

# Setup PostgreSQL Database for Portfolio
# This script helps you configure PostgreSQL database from Vercel

echo "🚀 Setting up PostgreSQL database for your portfolio..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Please follow these steps to get your database URLs:"
echo ""
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your portfolio project"
echo "3. Navigate to the 'Storage' tab"
echo "4. If you haven't created a database:"
echo "   - Click 'Create Database'"
echo "   - Select 'Postgres'"
echo "   - Choose your region"
echo "   - Name it 'portfolio-db'"
echo "5. Copy the connection URLs provided"
echo ""

read -p "Do you have your POSTGRES_PRISMA_URL? (y/n): " has_pooling_url
if [ "$has_pooling_url" != "y" ]; then
    echo "❌ Please get your database URLs from Vercel first."
    exit 1
fi

read -p "Enter your POSTGRES_PRISMA_URL: " pooling_url
read -p "Enter your POSTGRES_URL_NON_POOLING: " direct_url

if [ -z "$pooling_url" ] || [ -z "$direct_url" ]; then
    echo "❌ Both URLs are required."
    exit 1
fi

# Update .env file
echo "📝 Updating .env file..."
if grep -q "POSTGRES_PRISMA_URL=" .env; then
    sed -i "s|POSTGRES_PRISMA_URL=.*|POSTGRES_PRISMA_URL=\"$pooling_url\"|" .env
else
    echo "POSTGRES_PRISMA_URL=\"$pooling_url\"" >> .env
fi

if grep -q "POSTGRES_URL_NON_POOLING=" .env; then
    sed -i "s|POSTGRES_URL_NON_POOLING=.*|POSTGRES_URL_NON_POOLING=\"$direct_url\"|" .env
else
    echo "POSTGRES_URL_NON_POOLING=\"$direct_url\"" >> .env
fi

echo "✅ Environment variables updated!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create and apply migrations
echo "🗄️ Creating database migrations..."
npx prisma migrate dev --name init

echo "🎉 PostgreSQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Test your connection: npm run db:studio"
echo "2. Seed your database: npm run db:seed"
echo "3. Deploy to Vercel: vercel --prod"
echo ""
echo "📖 For more details, check DATABASE_SETUP.md"

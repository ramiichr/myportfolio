# Database Setup Guide

This guide helps you set up PostgreSQL database for your portfolio application using Prisma Postgres with Accelerate.

## Prerequisites

- Prisma account
- Prisma CLI installed
- Project configured with Prisma Postgres

## Database Configuration

Your database is configured with:

- **Prisma Postgres**: Managed PostgreSQL database
- **Prisma Accelerate**: Connection pooling and caching for improved performance
- **Direct Connection**: For migrations and administrative tasks

## Environment Variables

Your `.env` file contains:

```env
# Direct PostgreSQL connection
POSTGRES_POSTGRES_URL="postgres://user:password@db.prisma.io:5432/?sslmode=require"

# Prisma Accelerate URL (for connection pooling and caching)
POSTGRES_PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_api_key"

# Direct PostgreSQL connection (alternative name)
POSTGRES_DATABASE_URL="postgres://user:password@db.prisma.io:5432/?sslmode=require"
```

## Database Operations

### Generate Prisma Client

```bash
npx prisma generate
```

### Database Migrations

#### Create Migration (Development)

```bash
npx prisma migrate dev --name migration_name
```

#### Deploy Migration (Production)

```bash
npx prisma migrate deploy
```

#### Check Migration Status

```bash
npx prisma migrate status
```

#### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

### Database Management

#### Open Prisma Studio

```bash
npx prisma studio
```

#### Seed Database

```bash
npm run db:seed
```

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_your_change

# 3. Generate client
npx prisma generate
```

## Production Deployment

Your build scripts automatically handle production deployment:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma migrate deploy"
  }
}
```

This ensures:

1. Prisma client is generated with the latest schema
2. Database migrations are applied after build

## Available NPM Scripts

```bash
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:migrate:deploy  # Deploy migrations (production)
npm run db:reset          # Reset database (development)
npm run db:studio         # Open Prisma Studio
npm run db:seed           # Seed database
npm run db:status         # Check migration status
```

## Prisma Accelerate Benefits

- **Connection Pooling**: Efficiently manages database connections
- **Query Caching**: Reduces database load and improves response times
- **Global Edge**: Distributed across multiple regions for low latency
- **Automatic Scaling**: Handles traffic spikes automatically

## Troubleshooting

### Common Issues

1. **Connection Error**: Verify `POSTGRES_PRISMA_DATABASE_URL` and `POSTGRES_POSTGRES_URL` are correctly set
2. **Migration Fails**: Check database permissions and network connectivity
3. **Prisma Client Error**: Run `npx prisma generate` after schema changes

### Environment Variable Issues

If you encounter environment variable issues:

1. Check `.env` file exists with correct variables
2. Restart your development server
3. Verify the API key in your POSTGRES_PRISMA_DATABASE_URL is valid

### Prisma Accelerate Issues

- Ensure your API key is valid and not expired
- Check your Prisma Console for any service status issues
- Verify your connection URL format is correct

## Security Notes

- Never commit database URLs or API keys to version control
- Use Prisma Accelerate URL for application queries (better performance)
- Use direct PostgreSQL URL only for migrations and admin tasks
- Rotate API keys regularly through Prisma Console

## Next Steps

After setting up the database:

1. Test your connection: `npm run db:studio`
2. Seed the database: `npm run db:seed`
3. Deploy your application
4. Monitor performance through Prisma Console

## Resources

- [Prisma Postgres Documentation](https://www.prisma.io/postgres)
- [Prisma Accelerate Documentation](https://www.prisma.io/accelerate)
- [Prisma Console](https://console.prisma.io/)

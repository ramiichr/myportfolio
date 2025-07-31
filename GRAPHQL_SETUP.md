# GraphQL Portfolio Management

This project now includes GraphQL integration for dynamic portfolio data management using Apollo Server and Prisma.

## Features

- **GraphQL API**: Full CRUD operations for portfolio data
- **Database**: SQLite database with Prisma ORM
- **Admin Interface**: React-based admin panel for managing content
- **Multi-language Support**: Content management for English, German, and French
- **Real-time Updates**: Dynamic data loading with Apollo Client

## GraphQL Setup

### Database Schema

The portfolio data is stored in a SQLite database with the following models:

- **Profile**: Personal information in multiple languages
- **Project**: Portfolio projects with localized content
- **Skill**: Technical skills and categories
- **Experience**: Work experience with descriptions
- **Education**: Educational background

### API Endpoints

- **GraphQL Endpoint**: `/api/graphql`
- **Seed Endpoint**: `/api/seed` (POST) - Seeds database with existing data
- **Admin Interface**: `/admin` - Management dashboard

### Available Scripts

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:reset       # Reset database
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database with data

# Development
npm run dev           # Start development server
```

## Admin Interface

Access the admin interface at `/admin` to:

- ✅ **Manage Projects**: Add, edit, delete projects
- ✅ **Manage Skills**: CRUD operations for skills
- 🔄 **View Experience**: Read-only view (editing coming soon)
- 🔄 **View Profile**: Read-only view (editing coming soon)
- ✅ **Multi-language**: Switch between EN/DE/FR content

## GraphQL Queries

### Get Portfolio Data

```graphql
query GetPortfolioData($language: String!) {
  portfolioData(language: $language) {
    profile {
      name
      title
      description
      email
      phone
      location
      github
      linkedin
      twitter
    }
    projects {
      id
      title
      description
      image
      tags
      link
      github
      category
      featured
    }
    skills {
      id
      name
      icon
      category
    }
    experiences {
      id
      position
      company
      period
      location
      description
    }
    education {
      id
      degree
      institution
      period
      location
      description
    }
  }
}
```

### Create Project

```graphql
mutation CreateProject($input: ProjectInput!) {
  createProject(input: $input) {
    id
    title
    description
    tags
  }
}
```

## Migration from Static Data

The system maintains backward compatibility:

1. **Static data** from `data/portfolio-data.ts` serves as fallback
2. **GraphQL data** takes precedence when available
3. **Seed function** populates database from static data
4. **Gradual migration** allows smooth transition

## Next Steps

- [ ] Complete admin interface for Experience/Education editing
- [ ] Add image upload functionality
- [ ] Implement data validation
- [ ] Add real-time subscriptions
- [ ] Optimize for production deployment

## Technology Stack

- **Backend**: Apollo Server, Prisma, SQLite
- **Frontend**: Apollo Client, React, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Database**: SQLite (development), PostgreSQL (production ready)

# My Portfolio Website

A modern, responsive portfolio website built with Next.js 14 and TypeScript. Features include internationalization (English/German), dark/light mode, animations with Framer Motion, and a dashboard for visitor analytics using Redis.

## Live Demo

Visit the live site: [https://rami-cheikhrouhou.vercel.app](https://rami-cheikhrouhou.vercel.app)

## Features

- 🌓 **Dark/Light Mode** - Theme switching with system preference support
- 🌍 **Internationalization** - English and German language support
- 📱 **Responsive Design** - Mobile-first approach with a clean UI
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed
- 📊 **Analytics Dashboard** - Track visitor statistics with Redis
- 🎨 **Modern UI** - Built with Tailwind CSS and Shadcn UI
- 🔄 **Smooth Animations** - Page transitions and UI animations with Framer Motion
- 📧 **Contact Form** - Built-in contact form functionality
- 🔍 **SEO Optimized** - Meta tags and OpenGraph support

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Database**: Upstash Redis
- **Deployment**: Vercel
- **Analytics**: Custom Redis-based analytics

## Development Tools

- **Node.js**: v18.0.0 or higher
- **PNPM**: Package manager
- **Git**: Version control
- **VS Code** (recommended): Code editor
  - **Recommended Extensions**:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - PostCSS Language Support

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ramiichr/myportfolio.git
   cd myportfolio
   ```

2. **Install PNPM** (if not already installed)

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Redis Configuration (Required for analytics)
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

   # Visitor Tracking
   VISITOR_API_TOKEN=your-secure-token
   NEXT_PUBLIC_ENABLE_TRACKING=true
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   The site will be available at [http://localhost:3000](http://localhost:3000)

6. **Build for production**

   ```bash
   pnpm build
   ```

7. **Run production server**
   ```bash
   pnpm start
   ```

## Redis Setup

For the analytics dashboard to work, you'll need to set up a Redis database:

1. Create a free account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and REST Token
4. Add them to your `.env.local` file

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Project Structure Explanation

- `app/` - Next.js 14 app directory containing:
  - `page.tsx` - Home page
  - `layout.tsx` - Root layout
  - `globals.css` - Global styles
  - Feature directories (`about/`, `projects/`, etc.)
- `components/` - Reusable React components:
  - `ui/` - Shadcn UI components
  - `sections/` - Page sections
  - `common/` - Shared components
- `data/` - Static content and configuration
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and API helpers
- `public/` - Static assets
- `types/` - TypeScript type definitions

### Customization

1. **Content**: Update `data/portfolio-data.ts` with your information
2. **Styling**: Modify `tailwind.config.ts` for theme customization
3. **Internationalization**: Edit files in `i18n/` directory
4. **Environment Variables**: Update `.env.local` as needed

### Development Best Practices

1. Follow the TypeScript types defined in `types/`
2. Use the existing component structure in `components/`
3. Follow the established naming conventions
4. Add comments for complex logic
5. Use the pre-configured ESLint and Prettier settings

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM package manager
- Redis (see [Redis Setup](REDIS_SETUP.md))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file:

   ```
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   VISITOR_API_TOKEN=your-secure-token
   NEXT_PUBLIC_ENABLE_TRACKING=true
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - Reusable React components
- `data/` - Static data and content
- `i18n/` - Internationalization files
- `lib/` - Utility functions and API helpers
- `public/` - Static assets
- `types/` - TypeScript type definitions

## Analytics Dashboard

The project includes a custom analytics dashboard built with Redis. To set it up:

1. Follow the [Redis Setup Guide](REDIS_SETUP.md)
2. Access the dashboard at `/dashboard`
3. Use your `VISITOR_API_TOKEN` to log in

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
- [Upstash](https://upstash.com) for the serverless Redis database

## Contact

Rami Cheikh Rouhou - [ramii.cheikhrouhou@gmail.com](mailto:ramii.cheikhrouhou@gmail.com)

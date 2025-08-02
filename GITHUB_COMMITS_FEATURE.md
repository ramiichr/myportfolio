# Latest Commits Feature

This feature adds the ability to display your latest GitHub commits in your portfolio. It fetches real-time commit data from GitHub's API and displays it in a beautiful, responsive interface.

## Features

### 1. Real-time Commit Data

- Fetches commits from all your public repositories
- Shows commits from the last 30 days
- Displays commit messages, timestamps, and repository information
- Includes author avatars and commit URLs

### 2. API Endpoints

#### `/api/github/commits`

- **Method**: GET
- **Parameters**:
  - `username` (optional): GitHub username (defaults to "ramiichr")
- **Response**: Array of commit objects with full details

#### Example Response:

```json
{
  "commits": [
    {
      "sha": "abc1234",
      "message": "Add GitHub commits display functionality",
      "author": {
        "name": "Rami Cheikh Rouhou",
        "username": "ramiichr",
        "avatar_url": "https://github.com/ramiichr.png"
      },
      "date": "2025-08-01T10:30:00Z",
      "repository": {
        "name": "myportfolio",
        "full_name": "ramiichr/myportfolio",
        "url": "https://github.com/ramiichr/myportfolio"
      },
      "url": "https://github.com/ramiichr/myportfolio/commit/abc1234",
      "type": "commit"
    }
  ]
}
```

### 3. UI Components

#### `<LatestCommits>` Component

Located at: `/components/latest-commits.tsx`

**Props:**

- `username` (string): GitHub username
- `title` (string, optional): Card title (default: "Latest Commits")
- `showTitle` (boolean, optional): Whether to show the title (default: true)
- `className` (string, optional): Additional CSS classes
- `maxCommits` (number, optional): Maximum number of commits to display (default: 10)

**Example Usage:**

```tsx
import LatestCommits from "@/components/latest-commits";

// Basic usage
<LatestCommits username="ramiichr" />

// Customized usage
<LatestCommits
  username="ramiichr"
  title="Recent Code Changes"
  maxCommits={5}
  className="mb-8"
/>
```

### 4. Features

#### Smart Fallback System

- If GitHub API fails, displays realistic fallback data
- Maintains the same interface and user experience
- Logs errors for debugging while keeping the UI functional

#### Responsive Design

- Mobile-optimized layout
- Touch-friendly interaction areas
- Smooth animations and transitions

#### Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Lazy loading with Suspense
- Efficient API calls with error handling

#### Interactive Elements

- Clickable commit links to GitHub
- Repository links
- Hover effects and animations
- Copy-friendly commit SHA hashes

### 5. Integration

The component is integrated into the GitHub page (`/app/github/page.tsx`) and displays:

1. **GitHub Statistics** (repositories, stars, forks, followers)
2. **Contributions Calendar** (visual contribution graph)
3. **Latest Commits** (NEW - real-time commit activity)
4. **Programming Languages** (usage statistics)
5. **Recent Activity** (general repository activity)

### 6. Styling

The component uses your existing design system:

- Shadcn/ui components (Card, Badge, Avatar, Button)
- Tailwind CSS for styling
- Your custom CSS variables for theming
- Responsive breakpoints matching your portfolio

### 7. Environment Setup

Make sure you have the following environment variables in your `.env` file:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=ramiichr
```

The GitHub token enables:

- Higher rate limits
- Access to private repository data (if needed)
- More detailed commit information

### 8. Error Handling

The component gracefully handles:

- Network failures
- API rate limits
- Invalid repositories
- Empty commit history
- Missing environment variables

### 9. Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus indicators

### 10. Future Enhancements

Potential improvements you could add:

- Commit filtering by repository
- Time range selection
- Commit statistics and analytics
- Integration with GitHub Actions status
- Commit diff previews

## How to Use

1. **Already Integrated**: The component is already added to your `/github` page
2. **Standalone Usage**: Import and use anywhere in your portfolio
3. **Customization**: Modify props to fit different contexts
4. **API Access**: Use the `/api/github/commits` endpoint for custom implementations

Visit your portfolio at `/github` to see the latest commits in action!

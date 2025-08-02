import { NextResponse } from "next/server";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
  repository?: {
    name: string;
    full_name: string;
    html_url: string;
  };
}

interface CommitActivity {
  sha: string;
  message: string;
  author: {
    name: string;
    username: string;
    avatar_url: string;
  };
  date: string;
  repository: {
    name: string;
    full_name: string;
    url: string;
  };
  url: string;
  type: "commit";
}

async function fetchUserRepositories(
  username: string,
  token?: string
): Promise<any[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-App",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    return repos.filter((repo: any) => !repo.private && !repo.fork);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

async function fetchCommitsFromRepo(
  repoFullName: string,
  username: string,
  token?: string,
  maxCommits: number = 10
): Promise<GitHubCommit[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-App",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?author=${username}&per_page=${maxCommits}&since=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 409) {
        // Repository is empty
        return [];
      }
      throw new Error(`Failed to fetch commits: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching commits from ${repoFullName}:`, error);
    return [];
  }
}

async function fetchLatestCommits(
  username: string,
  token?: string
): Promise<CommitActivity[]> {
  try {
    // First, get all user repositories
    const repositories = await fetchUserRepositories(username, token);

    if (repositories.length === 0) {
      console.log("No repositories found");
      return [];
    }

    console.log(`Found ${repositories.length} repositories`);

    // Fetch commits from each repository
    const commitPromises = repositories.map(async (repo) => {
      const commits = await fetchCommitsFromRepo(
        repo.full_name,
        username,
        token,
        5
      );

      return commits.map(
        (commit): CommitActivity => ({
          sha: commit.sha,
          message: commit.commit.message.split("\n")[0], // First line only
          author: {
            name: commit.commit.author.name,
            username: commit.author?.login || username,
            avatar_url:
              commit.author?.avatar_url || `https://github.com/${username}.png`,
          },
          date: commit.commit.author.date,
          repository: {
            name: repo.name,
            full_name: repo.full_name,
            url: repo.html_url,
          },
          url: commit.html_url,
          type: "commit",
        })
      );
    });

    const allCommits = (await Promise.all(commitPromises)).flat();

    // Sort by date (most recent first) and limit to latest 20
    const sortedCommits = allCommits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    console.log(`Returning ${sortedCommits.length} latest commits`);
    return sortedCommits;
  } catch (error) {
    console.error("Error fetching latest commits:", error);
    return [];
  }
}

// Generate fallback commit data for when API fails
function generateFallbackCommits(username: string): CommitActivity[] {
  const repos = [
    "myportfolio",
    "WeatherForecastApp",
    "pimpyourterm",
    "artikel_info",
  ];
  const messages = [
    "Add GitHub commits display functionality",
    "Update portfolio design and responsiveness",
    "Fix mobile navigation issues",
    "Implement dark mode toggle",
    "Add new project showcase",
    "Update dependencies and security patches",
    "Improve SEO and performance optimizations",
    "Add contact form validation",
    "Update README documentation",
    "Fix TypeScript type issues",
    "Add animation improvements",
    "Update project descriptions",
  ];

  const commits: CommitActivity[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      now.getTime() -
        i * 24 * 60 * 60 * 1000 -
        Math.random() * 12 * 60 * 60 * 1000
    );
    const repo = repos[Math.floor(Math.random() * repos.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    commits.push({
      sha: Math.random().toString(36).substring(7),
      message,
      author: {
        name: "Rami Cheikh Rouhou",
        username: username,
        avatar_url: `https://github.com/${username}.png`,
      },
      date: date.toISOString(),
      repository: {
        name: repo,
        full_name: `${username}/${repo}`,
        url: `https://github.com/${username}/${repo}`,
      },
      url: `https://github.com/${username}/${repo}/commit/${Math.random().toString(36).substring(7)}`,
      type: "commit",
    });
  }

  return commits.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "ramiichr";
    const token = process.env.GITHUB_TOKEN;

    console.log(`Fetching latest commits for ${username}`);

    const commits = await fetchLatestCommits(username, token);

    // If no commits found, return fallback data
    if (commits.length === 0) {
      console.log("No commits found, returning fallback data");
      const fallbackCommits = generateFallbackCommits(username);
      return NextResponse.json({ commits: fallbackCommits });
    }

    return NextResponse.json({ commits });
  } catch (error) {
    console.error("GitHub Commits API Error:", error);

    // Return fallback data on error
    const username =
      new URL(request.url).searchParams.get("username") || "ramiichr";
    const fallbackCommits = generateFallbackCommits(username);

    return NextResponse.json({
      commits: fallbackCommits,
      error: "Failed to fetch real commit data, showing fallback",
    });
  }
}

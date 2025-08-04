"use client";

import { useState, useEffect, memo } from "react";
import { GitCommit, ExternalLink, Clock, User, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/language-provider";

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

interface CommitsResponse {
  commits: CommitActivity[];
  error?: string;
}

interface LatestCommitsProps {
  username: string;
  title?: string;
  showTitle?: boolean;
  className?: string;
  maxCommits?: number;
}

const formatRelativeTime = (date: string, translations?: any): string => {
  const now = new Date();
  const commitDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - commitDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return translations?.github?.commits?.timeAgo?.justNow || "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const template =
      translations?.github?.commits?.timeAgo?.minutesAgo || "{{count}}m ago";
    return template.replace("{{count}}", diffInMinutes.toString());
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const template =
      translations?.github?.commits?.timeAgo?.hoursAgo || "{{count}}h ago";
    return template.replace("{{count}}", diffInHours.toString());
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    const template =
      translations?.github?.commits?.timeAgo?.daysAgo || "{{count}}d ago";
    return template.replace("{{count}}", diffInDays.toString());
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    const template =
      translations?.github?.commits?.timeAgo?.weeksAgo || "{{count}}w ago";
    return template.replace("{{count}}", diffInWeeks.toString());
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const template =
      translations?.github?.commits?.timeAgo?.monthsAgo || "{{count}}mo ago";
    return template.replace("{{count}}", diffInMonths.toString());
  }

  const diffInYears = Math.floor(diffInDays / 365);
  const template =
    translations?.github?.commits?.timeAgo?.yearsAgo || "{{count}}y ago";
  return template.replace("{{count}}", diffInYears.toString());
};

const CommitItem = memo(
  ({
    commit,
    translations,
  }: {
    commit: CommitActivity;
    translations?: any;
  }) => {
    const shortSha = commit.sha.substring(0, 7);
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={commit.author.avatar_url}
            alt={commit.author.name}
          />
          <AvatarFallback>
            {commit.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              title={commit.message}
            >
              {commit.message}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs font-mono">
              {shortSha}
            </Badge>
            <span>{translations?.github?.commits?.repository || "in"}</span>
            <a
              href={commit.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <GitBranch className="h-3 w-3" />
              {commit.repository.name}
            </a>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span title={formatDate(commit.date)}>
                {formatRelativeTime(commit.date, translations)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          asChild
        >
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            title={
              translations?.github?.commits?.viewCommit ||
              "View commit on GitHub"
            }
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }
);

CommitItem.displayName = "CommitItem";

const LatestCommits = memo(function LatestCommits({
  username,
  title = "Latest Commits",
  showTitle = true,
  className = "",
  maxCommits = 10,
}: LatestCommitsProps) {
  const [commits, setCommits] = useState<CommitActivity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setError(null);

        const response = await fetch(
          `/api/github/commits?username=${username}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch commits: ${response.status}`);
        }

        const data: CommitsResponse = await response.json();

        if (data.error) {
          console.warn("API returned fallback data:", data.error);
        }

        setCommits(data.commits.slice(0, maxCommits));
      } catch (err) {
        console.error("Error fetching commits:", err);
        setError("Failed to load commits");
      }
    };

    fetchCommits();
  }, [username, maxCommits]);

  if (error) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {translations?.contact?.sendButton || "Try Again"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (commits.length === 0) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <GitCommit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {translations?.github?.commits?.noCommits ||
                "No recent commits found"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              {title}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {translations?.github?.commits?.viewProfile || "View Profile"}
                </span>
                <span className="sm:hidden">
                  {translations?.github?.commits?.viewProfile || "Profile"}
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {commits.map((commit) => (
            <CommitItem
              key={`${commit.repository.name}-${commit.sha}`}
              commit={commit}
              translations={translations}
            />
          ))}
        </div>

        {commits.length >= maxCommits && (
          <div className="p-4 text-center border-t">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://github.com/${username}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {translations?.github?.commits?.viewAllRepos ||
                  "View All Repositories"}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default LatestCommits;

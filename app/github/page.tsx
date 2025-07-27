"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import { getProfile } from "@/lib/api";
import { LoadingSpinner } from "@/components/common";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Github,
  Star,
  GitFork,
  Code2,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

// Lazy load the GitHub contributions component
const GitHubContributions = lazy(
  () => import("@/components/github-contributions")
);

// GitHub Stats interface
interface GitHubStats {
  user: {
    login: string;
    name: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repos: any[];
  totalStars: number;
  totalForks: number;
  languages: Array<{ name: string; percentage: number; color: string }>;
  recentActivity: Array<{
    type: string;
    repo: string;
    message: string;
    date: string;
  }>;
  contributions: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        date: string;
        count: number;
        level: 0 | 1 | 2 | 3 | 4;
      }>;
    }>;
  };
}

export default function GitHubPage() {
  const { translations, language } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Optimize API calls - use a single API call that returns both profile and GitHub data
        const [profileData, githubResponse] = await Promise.all([
          getProfile(language),
          fetch("/api/github?username=ramiichr", {
            // Add cache headers for better performance
            headers: {
              "Cache-Control": "max-age=300", // Cache for 5 minutes
            },
          }),
        ]);

        if (!githubResponse.ok) {
          throw new Error(`GitHub API failed: ${githubResponse.status}`);
        }

        const githubData = await githubResponse.json();

        setProfile(profileData);
        setGithubStats(githubData);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Extract GitHub username from profile URL
  const getGitHubUsername = (url: string) => {
    try {
      const match = url.match(/github\.com\/([^\/]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error || !profile || !githubStats) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || "Failed to load content. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  const githubUsername = getGitHubUsername(profile.social.github);

  if (!githubUsername) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          GitHub profile not found in profile data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-12 sm:py-24 px-4 md:px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-16"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
              {translations?.github?.title || "GitHub Activity"}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            {translations?.github?.description ||
              "A visual representation of my coding activity and contributions over the past year."}
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span>Visit GitHub Profile</span>
            </a>
          </Button>
        </motion.div>

        {/* GitHub Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                {translations?.github?.stats?.repositories || "Repositories"}
              </CardTitle>
              <Code2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {githubStats.user.public_repos}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                {translations?.github?.stats?.stars || "Stars"}
              </CardTitle>
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {githubStats.totalStars}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                {translations?.github?.stats?.forks || "Forks"}
              </CardTitle>
              <GitFork className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {githubStats.totalForks}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                {translations?.github?.stats?.followers || "Followers"}
              </CardTitle>
              <Github className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {githubStats.user.followers}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contributions Calendar */}
        <motion.div
          className="mb-8 sm:mb-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {translations?.github?.contributionsTitle ||
                      "Contributions Calendar"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="grid grid-cols-53 gap-1">
                      {Array.from({ length: 371 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-3 bg-muted animate-pulse rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <GitHubContributions
              username={githubUsername}
              title={
                translations?.github?.contributionsTitle ||
                "Contributions Calendar"
              }
              className="w-full"
              contributionsData={githubStats.contributions}
            />
          </Suspense>
        </motion.div>

        {/* Languages and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Most Used Languages */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  {translations?.github?.sections?.languages ||
                    "Most Used Languages"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {githubStats.languages.map(
                    (
                      lang: { name: string; percentage: number; color: string },
                      index: number
                    ) => (
                      <div key={lang.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-muted-foreground">
                            {lang.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                              backgroundColor: lang.color,
                              width: `${lang.percentage}%`,
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  {translations?.github?.sections?.activity ||
                    "Recent Activity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {githubStats.recentActivity.map(
                    (
                      activity: {
                        type: string;
                        repo: string;
                        message: string;
                        date: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs w-fit">
                              {activity.type}
                            </Badge>
                            <span className="font-medium text-sm truncate">
                              {activity.repo}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 break-words">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

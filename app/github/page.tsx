"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { getProfile } from "@/lib/api";
import GitHubContributions from "@/components/github-contributions";
import LatestCommits from "@/components/latest-commits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Github,
  Star,
  GitFork,
  Code2,
  Calendar,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

// GitHub Stats interface
interface GitHubStats {
  user: {
    login: string;
    name: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    bio: string | null;
    location: string | null;
    blog: string | null;
    twitter_username: string | null;
    company: string | null;
  };
  repos: Array<{
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    html_url: string;
    private: boolean;
  }>;
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
  return (
    <Suspense fallback={<GitHubPageSkeleton />}>
      <GitHubPageContent />
    </Suspense>
  );
}

function GitHubPageSkeleton() {
  return (
    <div className="container pt-32 pb-12 sm:pb-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div className="h-8 sm:h-10 md:h-12 bg-muted rounded w-64 animate-pulse" />
          </div>
          <div className="h-4 bg-muted rounded w-96 mx-auto mb-6 animate-pulse" />
          <div className="h-10 bg-muted rounded w-40 mx-auto animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-8 bg-muted rounded w-12 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function GitHubPageContent() {
  const { translations, language } = useLanguage();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Get username from URL params, fallback to profile's GitHub username or default
  const urlUsername = searchParams.get("username");

  // Ensure client-side hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Determine username first (use URL param or fallback)
        let usernameToFetch = urlUsername || "ramiichr";

        // Create promises for parallel fetching
        const profilePromise = fetch(`/api/profile?language=${language}`, {
          headers: { "Cache-Control": "max-age=300" },
        });

        const githubPromise = fetch(
          `/api/github?username=${usernameToFetch}${selectedYear ? `&year=${selectedYear}` : ""}`,
          {
            headers: { "Cache-Control": "max-age=300" },
          }
        );

        // Fetch both APIs in parallel
        const [profileResponse, githubResponse] = await Promise.all([
          profilePromise,
          githubPromise,
        ]);

        // Process responses
        if (!profileResponse.ok) {
          throw new Error(`Profile API failed: ${profileResponse.status}`);
        }

        if (!githubResponse.ok) {
          throw new Error(`GitHub API failed: ${githubResponse.status}`);
        }

        const [profileData, githubData] = await Promise.all([
          profileResponse.json(),
          githubResponse.json(),
        ]);

        // Set profile data immediately for progressive loading
        setProfile(profileData);

        // If we didn't have a URL username, try to extract from profile
        if (!urlUsername && profileData?.social?.github) {
          const match = profileData.social.github.match(
            /github\.com\/([^\/]+)/
          );
          const extractedUsername = match ? match[1] : null;

          // If extracted username differs from fallback, refetch GitHub data
          if (extractedUsername && extractedUsername !== usernameToFetch) {
            const updatedGithubResponse = await fetch(
              `/api/github?username=${extractedUsername}${selectedYear ? `&year=${selectedYear}` : ""}`,
              {
                headers: { "Cache-Control": "max-age=300" },
              }
            );

            if (updatedGithubResponse.ok) {
              const updatedGithubData = await updatedGithubResponse.json();
              setGithubStats(updatedGithubData);
            } else {
              setGithubStats(githubData);
            }
          } else {
            setGithubStats(githubData);
          }
        } else {
          setGithubStats(githubData);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, [language, selectedYear, urlUsername]);

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

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || "Failed to load content. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // Show content based on loading state
  const canShowHeader = true; // Always show header structure
  const canShowStats = githubStats && !isLoading;
  const canShowCharts = githubStats && !isLoading;

  // Determine the GitHub username to display
  let githubUsername = urlUsername;
  if (!githubUsername && profile) {
    githubUsername = getGitHubUsername(profile.social.github);
  }
  if (!githubUsername) {
    githubUsername = "ramiichr"; // fallback
  }

  return (
    <div className="container pt-32 pb-12 sm:pb-24 px-4 md:px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-16"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.25 }}
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
              href={`https://github.com/${githubUsername}`}
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
        {canShowStats ? (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.25, delay: 0.1 }}
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
                  {githubStats?.user.public_repos || 0}
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
                  {githubStats?.totalStars || 0}
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
                  {githubStats?.totalForks || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                  {translations?.github?.stats?.followers || "Followers"}
                </CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold">
                  {githubStats?.user.followers || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-8 bg-muted rounded w-12 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* GitHub Contributions Calendar */}
        {canShowCharts && (
          <motion.div
            className="mb-8 sm:mb-12"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <GitHubContributions
              username={githubUsername}
              title={
                translations?.github?.contributionsTitle ||
                `Contributions in ${selectedYear}`
              }
              className="w-full"
              contributionsData={githubStats?.contributions}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              showYearSelector={true}
              userCreatedAt={githubStats?.user.created_at}
            />
          </motion.div>
        )}

        {/* Latest Commits */}
        {canShowCharts && (
          <motion.div
            className="mb-8 sm:mb-12"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <LatestCommits
              username={githubUsername}
              title={translations?.github?.commitsTitle || "Latest Commits"}
            />
          </motion.div>
        )}

        {/* Languages and Recent Activity */}
        {canShowCharts && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            {/* Top Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  {translations?.github?.sections?.languages || "Top Languages"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {githubStats?.languages.map(
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
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {translations?.github?.sections?.activity ||
                    "Recent Activity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {githubStats?.recentActivity.map(
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
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {activity.repo}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {activity.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

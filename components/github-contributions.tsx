"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Calendar, Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubContributionsProps {
  username: string;
  title?: string;
  showTitle?: boolean;
  className?: string;
  contributionsData?: ContributionsData | null;
}

const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const getLevelColor = (level: 0 | 1 | 2 | 3 | 4): string => {
  const colors = {
    0: "bg-gray-100 dark:bg-gray-800",
    1: "bg-green-200 dark:bg-green-900",
    2: "bg-green-300 dark:bg-green-700",
    3: "bg-green-500 dark:bg-green-600",
    4: "bg-green-700 dark:bg-green-500",
  };
  return colors[level];
};

const getMonthLabels = (weeks: ContributionWeek[]) => {
  const months: Array<{ name: string; index: number }> = [];
  let currentMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const month = date.getMonth();

      // Add month label for each new month, but only if there's enough space
      if (month !== currentMonth) {
        const dayOfMonth = date.getDate();
        // Only show month label if we're within the first two weeks of the month
        // This prevents overlapping labels for months that start late in a week
        if (dayOfMonth <= 14) {
          currentMonth = month;
          months.push({
            name: date.toLocaleDateString("en-US", { month: "short" }),
            index: weekIndex,
          });
        }
      }
    }
  });

  // Filter out months that are too close to each other (less than 2 weeks apart)
  const filteredMonths = months.filter((month, index) => {
    if (index === 0) return true;
    const previousMonth = months[index - 1];
    return month.index - previousMonth.index >= 2;
  });

  return filteredMonths;
};

// Memoized contribution day component for better performance
const ContributionDay = memo(
  ({
    day,
    formatTooltip,
  }: {
    day: ContributionDay;
    formatTooltip: (count: number, date: string) => string;
  }) => (
    <div
      className={`contribution-day h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-gray-400 cursor-pointer ${getLevelColor(
        day.level
      )}`}
      title={formatTooltip(day.count, day.date)}
    />
  )
);

ContributionDay.displayName = "ContributionDay";

// Mock data generator for demonstration
const generateMockData = (): ContributionsData => {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  let totalContributions = 0;

  // Generate 53 weeks of data
  for (let week = 0; week < 53; week++) {
    const contributionDays: ContributionDay[] = [];

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);

      if (currentDate <= today) {
        // Generate random contribution count with realistic patterns
        const random = Math.random();
        let count = 0;

        // More likely to have contributions on weekdays
        const isWeekday = day >= 1 && day <= 5;
        const baseChance = isWeekday ? 0.7 : 0.4;

        if (random < baseChance) {
          count = Math.floor(Math.random() * 12) + 1;
          totalContributions += count;
        }

        contributionDays.push({
          date: currentDate.toISOString().split("T")[0],
          count,
          level: getContributionLevel(count),
        });
      }
    }

    if (contributionDays.length > 0) {
      weeks.push({ contributionDays });
    }
  }

  return { totalContributions, weeks };
};

const GitHubContributions = memo(function GitHubContributions({
  username,
  title = "GitHub Contributions",
  showTitle = true,
  className = "",
  contributionsData = null,
}: GitHubContributionsProps) {
  const [data, setData] = useState<ContributionsData | null>(contributionsData);
  const [loading, setLoading] = useState(!contributionsData);
  const [error, setError] = useState<string | null>(null);

  // Memoize computed values to prevent unnecessary recalculations
  const monthLabels = useMemo(
    () => (data ? getMonthLabels(data.weeks) : []),
    [data]
  );

  const daysOfWeek = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  // Memoize tooltip formatter to prevent function recreation
  const formatTooltip = useCallback(
    (count: number, date: string) =>
      `${count} contributions on ${new Date(date).toLocaleDateString()}`,
    []
  );

  useEffect(() => {
    if (contributionsData) {
      setData(contributionsData);
      setLoading(false);
      return;
    }

    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real data from our GitHub API
        const response = await fetch(`/api/github?username=${username}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub data: ${response.status}`);
        }

        const githubData = await response.json();

        if (githubData.contributions) {
          setData(githubData.contributions);
        } else {
          throw new Error("No contributions data received");
        }
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        setError("Failed to load contributions data");

        // Fallback to mock data only if API fails
        const mockData = generateMockData();
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, contributionsData]);

  if (loading) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-53 gap-1">
              {Array.from({ length: 371 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-3" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || "No data available"}
          </p>
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
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
            <Button variant="outline" size="sm" asChild className="w-fit">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <span className="text-sm text-muted-foreground">
              {data.totalContributions} contributions in the last year
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-3 w-3 rounded-sm ${getLevelColor(
                      level as 0 | 1 | 2 | 3 | 4
                    )}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Fixed dimensions container to prevent layout shift */}
          <div className="relative min-h-[120px]">
            {/* Scrollable container with responsive scrollbar */}
            <div className="overflow-x-auto scrollbar-mobile">
              <div className="min-w-[800px]">
                {/* Fixed minimum width for consistency */}
                {/* Month labels */}
                <div className="flex mb-2 relative h-4">
                  {monthLabels.map((month, index) => (
                    <div
                      key={`${month.name}-${index}`}
                      className="text-xs text-muted-foreground absolute whitespace-nowrap"
                      style={{
                        left: `calc(${month.index} * 16px + 40px)`, // 16px per week (12px square + 4px gap), 40px offset for day labels + margin
                      }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-1 mr-2 w-8 flex-shrink-0">
                    {daysOfWeek.map((day, index) => (
                      <div
                        key={day}
                        className="h-3 flex items-center justify-end text-xs text-muted-foreground pr-1"
                        style={{
                          visibility: index % 2 === 1 ? "visible" : "hidden",
                        }}
                      >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contribution grid */}
                  <div className="contribution-grid flex gap-1">
                    {data.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.contributionDays.map((day, dayIndex) => (
                          <ContributionDay
                            key={`${weekIndex}-${dayIndex}`}
                            day={day}
                            formatTooltip={formatTooltip}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Default export for lazy loading
export default GitHubContributions;

// Named export for backward compatibility
export { GitHubContributions };

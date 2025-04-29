import { useState, useCallback } from "react";
import { VisitorStats } from "@/app/dashboard/types";

interface UseVisitorStatsReturn {
  stats: VisitorStats | null;
  loading: boolean;
  loadingVisitors: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  fetchStats: (
    token: string,
    includeVisitors?: boolean,
    page?: number
  ) => Promise<void>;
  resetError: () => void;
}

export const useVisitorStats = (): UseVisitorStatsReturn => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Initialize with today's date
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Create a safe setter for the date that won't cause a page refresh
  const safeSetSelectedDate = useCallback((date: string) => {
    // Prevent any default behavior that might cause a page refresh
    setSelectedDate(date);
  }, []);

  const resetError = useCallback(() => setError(null), []);

  const fetchStats = useCallback(
    async (
      token: string,
      includeVisitors: boolean = false,
      page: number = 1
    ) => {
      try {
        if (includeVisitors) {
          setLoadingVisitors(true);
        } else {
          setLoading(true);
        }
        resetError();

        // Record start time for performance measurement
        const startTime = performance.now();

        const url = new URL("/api/track", window.location.origin);

        if (includeVisitors) {
          url.searchParams.set("visitors", "true");
          url.searchParams.set("date", selectedDate);
          url.searchParams.set("page", page.toString());
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message || data.error || "Failed to fetch visitor stats"
          );
        }

        setStats(data);
        // Save the token if it worked
        localStorage.setItem("visitorApiToken", token);

        // Calculate and log the performance
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        console.log(`Data loaded in ${loadTime.toFixed(2)}ms`);

        // If this is visitor data and load time is more than 1000ms, show a message
        if (includeVisitors && loadTime > 1000) {
          console.log("Visitor data load time exceeded 1 second target");
        }
      } catch (err: any) {
        // Get a more specific error message if available
        const errorMessage =
          err.message ||
          "Failed to fetch visitor stats. Please check your API token.";
        setError(errorMessage);
        console.error("API Error:", err);

        // If the token is invalid, don't save it to localStorage
        if (
          errorMessage.includes("Unauthorized") ||
          errorMessage.includes("Invalid")
        ) {
          localStorage.removeItem("visitorApiToken");
        }
      } finally {
        if (includeVisitors) {
          setLoadingVisitors(false);
        } else {
          setLoading(false);
        }
      }
    },
    [selectedDate, resetError]
  );

  return {
    stats,
    loading,
    loadingVisitors,
    error,
    currentPage,
    setCurrentPage,
    selectedDate,
    setSelectedDate: safeSetSelectedDate, // Use our safe setter instead
    fetchStats,
    resetError,
  };
};

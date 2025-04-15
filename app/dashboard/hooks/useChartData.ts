import { useMemo } from "react";
import { VisitorStats, ChartDataPoint, PageViewDataPoint } from "../types";

interface UseChartDataReturn {
  pageViewsData: PageViewDataPoint[];
  dailyViewsData: ChartDataPoint[];
  uniqueVisitorsData: ChartDataPoint[];
  chartColors: string[];
}

export const useChartData = (
  stats: VisitorStats | null
): UseChartDataReturn => {
  // Colors for charts
  const chartColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Memoize chart data to prevent unnecessary recalculations
  const pageViewsData = useMemo(() => {
    if (!stats?.pageviewsByPage) return [];

    return Object.entries(stats.pageviewsByPage)
      .map(([page, count]) => ({
        page: page === "/" ? "Home" : page.replace(/^\//, ""),
        views: count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Top 10 pages
  }, [stats?.pageviewsByPage]);

  const dailyViewsData = useMemo(() => {
    if (!stats?.pageviewsByDate) return [];

    return Object.entries(stats.pageviewsByDate)
      .map(([date, count]) => ({
        date,
        views: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [stats?.pageviewsByDate]);

  const uniqueVisitorsData = useMemo(() => {
    if (!stats?.uniqueVisitors) return [];

    return Object.entries(stats.uniqueVisitors)
      .map(([date, count]) => ({
        date,
        visitors: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [stats?.uniqueVisitors]);

  return {
    pageViewsData,
    dailyViewsData,
    uniqueVisitorsData,
    chartColors,
  };
};

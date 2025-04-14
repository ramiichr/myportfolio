"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface VisitorData {
  page: string;
  referrer: string;
  userAgent: string;
  country?: string;
  city?: string;
  timestamp: number;
  ip: string;
}

interface PaginationInfo {
  totalVisitors: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

interface VisitorStats {
  totalPageviews: number;
  pageviewsByPage: Record<string, number>;
  pageviewsByDate: Record<string, number>;
  uniqueVisitors: Record<string, number>;
  visitors?: VisitorData[];
  pagination?: PaginationInfo;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    // Get the API token from localStorage if available
    const storedToken = localStorage.getItem("visitorApiToken");
    if (storedToken) {
      setApiToken(storedToken);
      setInputToken(storedToken);
      fetchStats(storedToken);
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    // Clear the API token from localStorage
    localStorage.removeItem("visitorApiToken");
    // Reset the state
    setApiToken("");
    setInputToken("");
    setStats(null);
    setError(null);
  };

  // Handle delete all data functionality
  const handleDeleteAllData = async () => {
    // If not yet confirmed, show confirmation UI
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch("/api/track", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete visitor data");
      }

      const result = await response.json();

      if (result.success) {
        // Reset stats after successful deletion
        setStats({
          totalPageviews: 0,
          pageviewsByPage: {},
          pageviewsByDate: {},
          uniqueVisitors: {},
        });

        // Show success message (could be enhanced with a toast notification)
        console.log("All visitor data has been deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete visitor data");
      }
    } catch (err) {
      console.error("Error deleting visitor data:", err);
      setError("Failed to delete visitor data. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(false);
    }
  };

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const fetchStats = async (
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
      console.log("Received visitor data:", data);

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || data.error || "Failed to fetch visitor stats"
        );
      }

      if (includeVisitors && data.visitors) {
        console.log("Visitor details:", data.visitors);
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
  };

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true); // Show loading state immediately
    setApiToken(inputToken);
    fetchStats(inputToken);
  };

  // Prepare data for charts
  const preparePageViewsData = () => {
    if (!stats?.pageviewsByPage) return [];

    return Object.entries(stats.pageviewsByPage)
      .map(([page, count]) => ({
        page: page === "/" ? "Home" : page.replace(/^\//, ""),
        views: count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Top 10 pages
  };

  const prepareDailyViewsData = () => {
    if (!stats?.pageviewsByDate) return [];

    return Object.entries(stats.pageviewsByDate)
      .map(([date, count]) => ({
        date,
        views: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  };

  const prepareUniqueVisitorsData = () => {
    if (!stats?.uniqueVisitors) return [];

    return Object.entries(stats.uniqueVisitors)
      .map(([date, count]) => ({
        date,
        visitors: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  };

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  if (!apiToken) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please enter your API token to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitToken} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apiToken" className="text-sm font-medium">
                  API Token
                </label>
                <input
                  id="apiToken"
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your API token"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Portfolio Analytics</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div
              className={`${error.includes("successfully") ? "text-green-500" : "text-red-500"}`}
            >
              {error}
            </div>
            {!error.includes("successfully") && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="apiTokenRetry"
                    className="text-sm font-medium"
                  >
                    API Token
                  </label>
                  <input
                    id="apiTokenRetry"
                    type="password"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your API token"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmitToken}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setApiToken("");
                      setError(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Page Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalPageviews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time page views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(stats?.pageviewsByPage || {}).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Different pages visited
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.pageviewsByDate?.[
                    new Date().toISOString().split("T")[0]
                  ] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Page views today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.uniqueVisitors?.[
                    new Date().toISOString().split("T")[0]
                  ] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique visitors today
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pageviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pageviews">Page Views</TabsTrigger>
              <TabsTrigger value="visitors">Unique Visitors</TabsTrigger>
              <TabsTrigger value="pages">Popular Pages</TabsTrigger>
              <TabsTrigger value="visitor-list">Visitor List</TabsTrigger>
            </TabsList>

            <TabsContent value="pageviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Page Views</CardTitle>
                  <CardDescription>
                    Page views over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareDailyViewsData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visitors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Unique Visitors</CardTitle>
                  <CardDescription>
                    Unique visitors over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareUniqueVisitorsData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visitors" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Pages</CardTitle>
                  <CardDescription>Top 10 most visited pages</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={preparePageViewsData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="views"
                        nameKey="page"
                      >
                        {preparePageViewsData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visitor-list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Information</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span>Detailed visitor information for selected date:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => {
                          setCurrentPage(1); // Reset to page 1 when loading new data
                          fetchStats(apiToken, true, 1);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Load
                      </button>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingVisitors ? (
                    <div className="flex flex-col justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="mt-4 text-gray-600">
                        Loading visitor data...
                      </p>
                    </div>
                  ) : !stats?.visitors ? (
                    <div className="text-center py-4">
                      <p>
                        Click "Load" to fetch visitor data for the selected date
                      </p>
                    </div>
                  ) : stats.visitors.length === 0 ? (
                    <div className="text-center py-4">
                      <p>No visitor data available for the selected date</p>
                    </div>
                  ) : (
                    <div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <th className="px-4 py-2 text-left">Time</th>
                              <th className="px-4 py-2 text-left">Page</th>
                              <th className="px-4 py-2 text-left">Location</th>
                              <th className="px-4 py-2 text-left">
                                IP Address
                              </th>
                              <th className="px-4 py-2 text-left hidden md:table-cell">
                                Referrer
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.visitors.map((visitor, index) => (
                              <tr
                                key={index}
                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                              >
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {new Date(
                                    visitor.timestamp
                                  ).toLocaleTimeString()}
                                </td>
                                <td className="px-4 py-2">
                                  <span
                                    className="inline-block max-w-[150px] truncate"
                                    title={visitor.page}
                                  >
                                    {visitor.page === "/"
                                      ? "Home"
                                      : visitor.page}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {visitor.city && visitor.city !== "Unknown"
                                    ? `${visitor.city}, ${visitor.country}`
                                    : visitor.country}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {visitor.ip && visitor.ip !== "Unknown"
                                    ? visitor.ip
                                    : "127.0.0.1"}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span
                                    className="inline-block max-w-[200px] truncate"
                                    title={visitor.referrer}
                                  >
                                    {visitor.referrer}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {stats.pagination && (
                        <div className="flex justify-between items-center mt-4 mb-2">
                          <div className="text-sm text-gray-600">
                            Showing{" "}
                            {stats.pagination?.currentPage * 10 - 9 || 1} to{" "}
                            {Math.min(
                              stats.pagination?.currentPage * 10 || 10,
                              stats.pagination?.totalVisitors || 0
                            )}{" "}
                            of {stats.pagination?.totalVisitors || 0} visitors
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const newPage = currentPage - 1;
                                setCurrentPage(newPage);
                                fetchStats(apiToken, true, newPage);
                              }}
                              disabled={currentPage <= 1}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage <= 1
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              Previous
                            </button>

                            {/* Page number buttons */}
                            <div className="flex space-x-1">
                              {Array.from(
                                {
                                  length: Math.min(
                                    5,
                                    stats.pagination?.totalPages || 1
                                  ),
                                },
                                (_, i) => {
                                  // Calculate which page numbers to show
                                  let pageNum;
                                  const totalPages =
                                    stats.pagination?.totalPages || 1;
                                  if (totalPages <= 5) {
                                    // If 5 or fewer pages, show all pages
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    // If near the start, show pages 1-5
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    // If near the end, show the last 5 pages
                                    pageNum = totalPages - 4 + i;
                                  } else {
                                    // Otherwise show 2 before and 2 after current page
                                    pageNum = currentPage - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => {
                                        setCurrentPage(pageNum);
                                        fetchStats(apiToken, true, pageNum);
                                      }}
                                      className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                        currentPage === pageNum
                                          ? "bg-blue-700 text-white font-bold"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                }
                              )}
                            </div>

                            <button
                              onClick={() => {
                                const newPage = currentPage + 1;
                                setCurrentPage(newPage);
                                fetchStats(apiToken, true, newPage);
                              }}
                              disabled={!stats.pagination?.hasMore}
                              className={`px-3 py-1 rounded text-sm ${
                                !stats.pagination?.hasMore
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="md:hidden mt-4">
                        <h3 className="font-medium text-sm mb-2">
                          Tap a visitor to see more details:
                        </h3>
                        {stats?.visitors &&
                          stats.visitors.map((visitor, index) => {
                            return (
                              <details
                                key={index}
                                className="mb-2 border rounded-md"
                              >
                                <summary className="p-3 cursor-pointer font-medium">
                                  {new Date(
                                    visitor.timestamp
                                  ).toLocaleTimeString()}{" "}
                                  -{" "}
                                  {visitor.page === "/" ? "Home" : visitor.page}
                                </summary>
                                <div className="p-3 pt-0 text-sm space-y-2 border-t">
                                  <p>
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {visitor.city && visitor.city !== "Unknown"
                                      ? `${visitor.city}, ${visitor.country}`
                                      : visitor.country}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      IP Address:
                                    </span>{" "}
                                    {visitor.ip && visitor.ip !== "Unknown"
                                      ? visitor.ip
                                      : "127.0.0.1"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Referrer:
                                    </span>{" "}
                                    {visitor.referrer}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      User Agent:
                                    </span>{" "}
                                    {visitor.userAgent}
                                  </p>
                                </div>
                              </details>
                            );
                          })}

                        {/* Mobile Pagination Controls */}
                        {stats.pagination && (
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-xs text-gray-600">
                              Page {stats.pagination?.currentPage || 1} of{" "}
                              {stats.pagination?.totalPages || 1}
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  const newPage = currentPage - 1;
                                  setCurrentPage(newPage);
                                  fetchStats(apiToken, true, newPage);
                                }}
                                disabled={currentPage <= 1}
                                className={`px-2 py-1 rounded text-xs ${
                                  currentPage <= 1
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                Prev
                              </button>

                              {/* Mobile page number buttons - show only 3 for mobile */}
                              {Array.from(
                                {
                                  length: Math.min(
                                    3,
                                    stats.pagination?.totalPages || 1
                                  ),
                                },
                                (_, i) => {
                                  // Calculate which page numbers to show
                                  let pageNum;
                                  const totalPages =
                                    stats.pagination?.totalPages || 1;
                                  if (totalPages <= 3) {
                                    // If 3 or fewer pages, show all pages
                                    pageNum = i + 1;
                                  } else if (currentPage <= 2) {
                                    // If near the start, show pages 1-3
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 1) {
                                    // If near the end, show the last 3 pages
                                    pageNum = totalPages - 2 + i;
                                  } else {
                                    // Otherwise show 1 before, current, and 1 after
                                    pageNum = currentPage - 1 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => {
                                        setCurrentPage(pageNum);
                                        fetchStats(apiToken, true, pageNum);
                                      }}
                                      className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                                        currentPage === pageNum
                                          ? "bg-blue-700 text-white font-bold"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                }
                              )}

                              <button
                                onClick={() => {
                                  const newPage = currentPage + 1;
                                  setCurrentPage(newPage);
                                  fetchStats(apiToken, true, newPage);
                                }}
                                disabled={!stats.pagination?.hasMore}
                                className={`px-2 py-1 rounded text-xs ${
                                  !stats.pagination?.hasMore
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setApiToken("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Change API Token
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {deleteConfirmation ? (
                <>
                  <span className="text-sm text-red-600 font-medium">
                    Are you sure?
                  </span>
                  <button
                    onClick={() => setDeleteConfirmation(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                </>
              ) : null}
              <button
                onClick={handleDeleteAllData}
                className={`px-4 py-2 ${
                  deleteConfirmation
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                } text-white rounded-md transition-colors flex items-center gap-2`}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                ) : null}
                {deleteConfirmation ? "Confirm Delete" : "Delete All Data"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

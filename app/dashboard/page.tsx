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

interface VisitorStats {
  totalPageviews: number;
  pageviewsByPage: Record<string, number>;
  pageviewsByDate: Record<string, number>;
  uniqueVisitors: Record<string, number>;
  visitors?: VisitorData[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {
    // Get the API token from localStorage if available
    const storedToken = localStorage.getItem("visitorApiToken");
    if (storedToken) {
      setApiToken(storedToken);
      fetchStats(storedToken);
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const fetchStats = async (
    token: string,
    includeVisitors: boolean = false
  ) => {
    try {
      if (includeVisitors) {
        setLoadingVisitors(true);
      } else {
        setLoading(true);
      }

      const url = new URL("/api/track", window.location.origin);

      if (includeVisitors) {
        url.searchParams.set("visitors", "true");
        url.searchParams.set("date", selectedDate);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visitor stats");
      }

      const data = await response.json();
      console.log("Received visitor data:", data);
      if (includeVisitors && data.visitors) {
        console.log("Visitor details:", data.visitors);
      }
      setStats(data);
      // Save the token if it worked
      localStorage.setItem("visitorApiToken", token);
    } catch (err) {
      setError("Failed to fetch visitor stats. Please check your API token.");
      console.error(err);
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
    fetchStats(apiToken);
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
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
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
            <div className="text-red-500">{error}</div>
            <button
              onClick={() => setApiToken("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Change API Token
            </button>
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
                        onClick={() => fetchStats(apiToken, true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Load
                      </button>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingVisitors ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-right">
            <button
              onClick={() => setApiToken("")}
              className="text-sm text-blue-600 hover:underline"
            >
              Change API Token
            </button>
          </div>
        </>
      )}
    </div>
  );
}

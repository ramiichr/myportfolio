"use client";

import { useEffect, useState } from "react";
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

interface VisitorStats {
  totalPageviews: number;
  pageviewsByPage: Record<string, number>;
  pageviewsByDate: Record<string, number>;
  uniqueVisitors: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchStats = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/track", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visitor stats");
      }

      const data = await response.json();
      setStats(data);
      // Save the token if it worked
      localStorage.setItem("visitorApiToken", token);
    } catch (err) {
      setError("Failed to fetch visitor stats. Please check your API token.");
      console.error(err);
    } finally {
      setLoading(false);
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
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
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
      <h1 className="text-4xl font-bold mb-6">Website Traffic Dashboard</h1>

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

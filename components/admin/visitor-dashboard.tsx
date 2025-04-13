"use client";

import { useState, useEffect } from "react";
import { getVisitors, deleteAllVisitors, checkDeletionStatus } from "@/lib/api";
import { Visitor } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function VisitorDashboard() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Authenticate with token
  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getVisitors(token);
      setVisitors(data);
      setIsAuthenticated(true);
      localStorage.setItem("visitorApiToken", token);
    } catch (error) {
      setError("Authentication failed. Please check your token.");
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter visitors by date range
  const handleFilterVisitors = async () => {
    setLoading(true);
    setError(null);
    setResetSuccess(null);

    try {
      const data = await getVisitors(token, startDate, endDate);
      setVisitors(data);
    } catch (error) {
      setError("Failed to fetch visitor data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete all visitors
  const handleDeleteAllVisitors = async () => {
    // Show confirmation dialog before deleting
    if (
      window.confirm(
        "Are you sure you want to delete ALL visitor data? This action cannot be undone."
      )
    ) {
      setLoading(true);
      setError(null);
      setResetSuccess(null);

      try {
        // Clear all visitor data from localStorage
        if (typeof window !== "undefined") {
          // Clear main visitors list
          localStorage.removeItem("portfolio_visitors");

          // Also clear any backups to ensure complete deletion
          localStorage.removeItem("portfolio_visitors_backup");
          localStorage.removeItem("portfolio_visitors_persistent");

          // Set a flag to indicate visitors were explicitly deleted
          // This prevents auto-restoration from backups
          localStorage.setItem("portfolio_visitors_deleted", "true");

          // For extra safety, also set empty arrays
          localStorage.setItem("portfolio_visitors", JSON.stringify([]));
          localStorage.setItem("portfolio_visitors_backup", JSON.stringify([]));
          localStorage.setItem(
            "portfolio_visitors_persistent",
            JSON.stringify([])
          );

          // Also notify the server to delete visitors
          await deleteAllVisitors(token);

          // Double-check the deletion status
          try {
            const status = await checkDeletionStatus(token);
            console.log(
              `Deletion verification: isDeleted=${status.isDeleted}, cacheSize=${status.cacheSize}`
            );

            if (!status.isDeleted || status.cacheSize > 0) {
              console.warn(
                "Warning: Server may not have fully deleted visitors"
              );
            }
          } catch (statusError) {
            console.error("Error checking deletion status:", statusError);
          }

          // Update the UI
          setVisitors([]);
          setResetSuccess("All visitor data has been permanently deleted.");

          // Force a refresh of the page after a short delay to ensure everything is reset
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setError("Failed to delete visitor data.");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Manually persist the current visitors list
  const handlePersistVisitorsList = () => {
    setLoading(true);
    setError(null);
    setResetSuccess(null);

    try {
      // Create a backup of the current visitors in a different localStorage key
      if (typeof window !== "undefined" && visitors.length > 0) {
        // Store in a backup key that won't be automatically cleared
        localStorage.setItem(
          "portfolio_visitors_backup",
          JSON.stringify(visitors)
        );
        setResetSuccess(
          "Visitors list has been backed up successfully. You can restore it if needed."
        );
      } else {
        setError("No visitors to backup.");
      }
    } catch (error) {
      setError("Failed to backup visitors list.");
      console.error("Backup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Restore visitors from backup
  const handleRestoreVisitorsList = () => {
    setLoading(true);
    setError(null);
    setResetSuccess(null);

    try {
      // Restore from backup
      if (typeof window !== "undefined") {
        const backupStr = localStorage.getItem("portfolio_visitors_backup");
        if (backupStr) {
          const backupVisitors = JSON.parse(backupStr) as Visitor[];
          localStorage.setItem(
            "portfolio_visitors",
            JSON.stringify(backupVisitors)
          );
          setVisitors(backupVisitors);
          setResetSuccess("Visitors list has been restored successfully.");
        } else {
          setError("No backup found to restore.");
        }
      }
    } catch (error) {
      setError("Failed to restore visitors list.");
      console.error("Restore error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check for saved token on component mount and set up auto-refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("visitorApiToken");
    if (savedToken) {
      setToken(savedToken);

      const fetchVisitors = async () => {
        setLoading(true);
        try {
          const data = await getVisitors(savedToken);
          setVisitors(data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be invalid or expired
          localStorage.removeItem("visitorApiToken");
          console.error("Token validation error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVisitors();

      // Set up an interval to refresh the visitors list every 5 seconds
      // This ensures we see new visitors quickly
      const refreshInterval = setInterval(async () => {
        try {
          // Fetch fresh data from the API instead of just using localStorage
          const freshData = await getVisitors(savedToken);

          // Always update with the latest data
          if (freshData && Array.isArray(freshData)) {
            // Check if the length has changed for logging purposes
            if (freshData.length !== visitors.length) {
              console.log(
                `Refreshed visitor data: ${visitors.length} → ${freshData.length} visitors`
              );
            }

            // Always update the state with the latest data
            setVisitors(freshData);
          }
        } catch (error) {
          console.error("Error refreshing visitor data:", error);

          // Fallback to localStorage if API fails
          if (typeof window !== "undefined") {
            const visitorsStr = localStorage.getItem("portfolio_visitors");
            if (visitorsStr) {
              try {
                const currentVisitors = JSON.parse(visitorsStr) as Visitor[];
                // Only update if there are visitors to display
                if (currentVisitors.length > 0) {
                  setVisitors(currentVisitors);
                }
              } catch (error) {
                console.error(
                  "Error parsing visitors from localStorage:",
                  error
                );
              }
            }
          }
        }
      }, 5000); // 5 seconds for more responsive updates

      // Clean up the interval when the component unmounts
      return () => clearInterval(refreshInterval);
    }
  }, []);

  // Prepare data for charts
  const preparePageViewData = () => {
    const pageViews = visitors.reduce(
      (acc, visitor) => {
        const path = visitor.path;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(pageViews).map(([name, value]) => ({ name, value }));
  };

  const prepareLocationData = () => {
    const locations = visitors.reduce(
      (acc, visitor) => {
        const country = visitor.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(locations).map(([name, value]) => ({ name, value }));
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 mt-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>
              Enter your API token to access the visitor dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">API Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your API token"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                onClick={handleAuthenticate}
                disabled={loading || !token}
                className="w-full"
              >
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 pt-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Visitor Dashboard</h1>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to site
          </a>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handlePersistVisitorsList}
            disabled={loading || visitors.length === 0}
          >
            Backup Visitors
          </Button>
          <Button
            variant="secondary"
            onClick={handleRestoreVisitorsList}
            disabled={loading}
          >
            Restore Backup
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAllVisitors}
            disabled={loading}
          >
            Delete All Visitors
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("visitorApiToken");
              setIsAuthenticated(false);
              setToken("");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Visitors</CardTitle>
          <CardDescription>Filter visitor data by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilterVisitors} disabled={loading}>
                {loading ? "Loading..." : "Apply Filter"}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {resetSuccess && (
            <p className="text-sm text-green-500 mt-2">{resetSuccess}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{visitors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {new Set(visitors.map((v) => v.country).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Visitor Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePageViewData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePageViewData().map((entry, index) => (
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
            <Card>
              <CardHeader>
                <CardTitle>Visitor Locations</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareLocationData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Log</CardTitle>
              <CardDescription>
                Detailed information about each visitor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Referrer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No visitor data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      visitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell>
                            {new Date(visitor.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>{visitor.path}</TableCell>
                          <TableCell>
                            {visitor.city && visitor.country
                              ? `${visitor.city}, ${visitor.country}`
                              : visitor.country || "Unknown"}
                          </TableCell>
                          <TableCell>{visitor.ip}</TableCell>
                          <TableCell>{visitor.referrer || "Direct"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVisitors } from "@/lib/api";
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

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  // Check for saved token on component mount
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
      <div className="container mx-auto py-10">
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Visitor Dashboard</h1>
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

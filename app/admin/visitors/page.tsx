"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface VisitorData {
  ip: string;
  timestamp: string;
  userAgent: string;
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  timezone?: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Function to fetch visitors data
  const fetchVisitors = async (authToken?: string) => {
    try {
      setLoading(true);
      setError(null);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token is provided
      if (authToken || token) {
        headers["Authorization"] = `Bearer ${authToken || token}`;
      }

      const response = await fetch("/api/track-visitor", {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error("Unauthorized: Invalid token");
        }
        throw new Error(`Failed to fetch visitor data: ${response.status}`);
      }

      const data = await response.json();
      setVisitors(data.visitors || []);
      setAuthenticated(true);

      // Save token to localStorage if successful
      if (authToken || token) {
        localStorage.setItem("visitorApiToken", authToken || token);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Try to authenticate with token
  const authenticate = () => {
    if (token) {
      fetchVisitors(token);
    } else {
      setError("Please enter an API token");
    }
  };

  useEffect(() => {
    // Check if we have a saved token
    const savedToken = localStorage.getItem("visitorApiToken");

    if (savedToken) {
      setToken(savedToken);
      fetchVisitors(savedToken);
    } else {
      // In development, try without token
      if (process.env.NODE_ENV === "development") {
        fetchVisitors();
      } else {
        setLoading(false);
        setAuthenticated(false);
      }
    }
  }, []);

  // Count visitors by country
  const visitorsByCountry = visitors.reduce(
    (acc, visitor) => {
      const country = visitor.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Count visitors by city
  const visitorsByCity = visitors.reduce(
    (acc, visitor) => {
      const city = visitor.city || "Unknown";
      // Include country with city for better context
      const cityWithCountry = visitor.country
        ? `${city} (${visitor.country})`
        : city;
      acc[cityWithCountry] = (acc[cityWithCountry] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Group visitors by date
  const visitorsByDate = visitors.reduce(
    (acc, visitor) => {
      const date = new Date(visitor.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Authentication UI
  if (!authenticated && !loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
            <CardDescription>
              Please authenticate to view visitor data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter API token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      authenticate();
                    }
                  }}
                />
                <button
                  onClick={authenticate}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Authenticate
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <p className="text-sm text-muted-foreground">
                In development mode, you can access this page without a token.
                In production, you need to provide the API token set in your
                environment variables.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
            <CardDescription>Loading visitor data...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error && authenticated) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Failed to load visitor data: {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => fetchVisitors()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Visitor Statistics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fetchVisitors()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("visitorApiToken");
              setAuthenticated(false);
              setToken("");
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{visitors.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {Object.keys(visitorsByCountry).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Visitors</TabsTrigger>
          <TabsTrigger value="countries">By Country</TabsTrigger>
          <TabsTrigger value="cities">By City</TabsTrigger>
          <TabsTrigger value="dates">By Date</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Visitors</CardTitle>
              <CardDescription>
                Complete list of all visitors to your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Region</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No visitors recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      visitors.map((visitor, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(visitor.timestamp)}</TableCell>
                          <TableCell>{visitor.ip}</TableCell>
                          <TableCell>{visitor.country || "Unknown"}</TableCell>
                          <TableCell>{visitor.city || "Unknown"}</TableCell>
                          <TableCell>{visitor.region || "Unknown"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by Country</CardTitle>
              <CardDescription>
                Breakdown of visitors by country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(visitorsByCountry)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .map(([country, count]) => (
                    <div
                      key={country}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span>{country}</span>
                      <Badge variant="secondary">
                        {count} visitor{count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by City</CardTitle>
              <CardDescription>Breakdown of visitors by city</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(visitorsByCity)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .map(([city, count]) => (
                    <div
                      key={city}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span>{city}</span>
                      <Badge variant="secondary">
                        {count} visitor{count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dates">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by Date</CardTitle>
              <CardDescription>Breakdown of visitors by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(visitorsByDate)
                  .sort(([dateA, _], [dateB, __]) => {
                    // Sort by date (newest first)
                    return (
                      new Date(dateB).getTime() - new Date(dateA).getTime()
                    );
                  })
                  .map(([date, count]) => (
                    <div
                      key={date}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span>{date}</span>
                      <Badge variant="secondary">
                        {count} visitor{count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

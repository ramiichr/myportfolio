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

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/track-visitor");

        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }

        const data = await response.json();
        setVisitors(data.visitors || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
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

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Failed to load visitor data: {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Visitor Statistics</h1>

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

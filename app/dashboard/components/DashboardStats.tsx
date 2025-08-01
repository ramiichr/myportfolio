import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Database, Globe } from "lucide-react";

interface DashboardStatsProps {
  stats: any;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const analyticsStats = [
    {
      title: "Total Page Views",
      value: stats?.totalPageviews || 0,
      description: "All time visits",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Total Visitors",
      value: stats?.totalVisitors || 0,
      description: "Unique visitors",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Database",
      value: "GraphQL",
      description: "Portfolio API active",
      icon: <Database className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      title: "Languages",
      value: 3,
      description: "EN, DE, FR support",
      icon: <Globe className="h-5 w-5" />,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {analyticsStats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`${stat.color}`}>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

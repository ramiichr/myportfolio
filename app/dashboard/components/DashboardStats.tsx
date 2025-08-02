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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {analyticsStats.map((stat, index) => (
        <Card key={index} className="transition-transform hover:scale-105">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {stat.description}
                </p>
              </div>
              <div className={`${stat.color} flex-shrink-0 ml-2`}>
                <div className="h-4 w-4 sm:h-5 sm:w-5">{stat.icon}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

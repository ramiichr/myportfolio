import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitorStats } from "../types";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface StatsCardsProps {
  stats: VisitorStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Total Page Views"
        value={stats?.totalPageviews || 0}
        description="All time page views"
      />

      <StatsCard
        title="Unique Pages"
        value={Object.keys(stats?.pageviewsByPage || {}).length}
        description="Different pages visited"
      />

      <StatsCard
        title="Today's Views"
        value={stats?.pageviewsByDate?.[today] || 0}
        description="Page views today"
      />

      <StatsCard
        title="Today's Visitors"
        value={stats?.uniqueVisitors?.[today] || 0}
        description="Unique visitors today"
      />
    </div>
  );
};

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/app/dashboard/types";

interface VisitorsChartProps {
  data: ChartDataPoint[];
}

export const VisitorsChart: React.FC<VisitorsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Unique Visitors</CardTitle>
        <CardDescription>Unique visitors over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
  );
};

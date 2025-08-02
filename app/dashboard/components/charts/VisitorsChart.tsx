import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">
          Daily Unique Visitors
        </CardTitle>
        <CardDescription className="text-sm">
          Unique visitors over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px] p-2 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: isMobile ? 40 : 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={isMobile ? -90 : -45}
              textAnchor="end"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              height={isMobile ? 80 : 60}
              interval={isMobile ? 1 : 0}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 30 : 40}
            />
            <Tooltip
              contentStyle={{
                fontSize: isMobile ? "12px" : "14px",
                padding: isMobile ? "8px" : "12px",
              }}
            />
            <Bar dataKey="visitors" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

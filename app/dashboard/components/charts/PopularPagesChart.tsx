import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PageViewDataPoint } from "@/app/dashboard/types";

interface PopularPagesChartProps {
  data: PageViewDataPoint[];
  colors: string[];
}

export const PopularPagesChart: React.FC<PopularPagesChartProps> = ({
  data,
  colors,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mobile-responsive label function
  const renderLabel = ({ name, percent }: any) => {
    if (isMobile && percent < 0.05) return ""; // Hide labels for small slices on mobile
    const maxLength = isMobile ? 10 : 20;
    const truncatedName =
      name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    return `${truncatedName} (${(percent * 100).toFixed(0)}%)`;
  };

  const outerRadius = isMobile ? 60 : isTablet ? 70 : 80;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Popular Pages</CardTitle>
        <CardDescription className="text-sm">
          Top 10 most visited pages
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px] p-2 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={!isMobile}
              label={renderLabel}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="views"
              nameKey="page"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: isMobile ? "12px" : "14px",
                padding: isMobile ? "8px" : "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

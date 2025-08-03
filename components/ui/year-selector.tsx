"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  startYear: number;
  className?: string;
}

export function YearSelector({
  selectedYear,
  onYearChange,
  startYear,
  className = "",
}: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span>{selectedYear}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {years.map((year) => (
            <DropdownMenuItem
              key={year}
              onClick={() => onYearChange(year)}
              className="flex items-center justify-between"
            >
              <span>{year}</span>
              {year === selectedYear && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

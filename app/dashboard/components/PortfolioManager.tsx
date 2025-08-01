import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Plus,
  BarChart3,
  Users,
  Briefcase,
  GraduationCap,
  Settings,
} from "lucide-react";
import { PortfolioOverview } from "./PortfolioOverview";

interface PortfolioManagerProps {
  onSeedDatabase: () => void;
  onNavigateToSection: (section: string) => void;
  isSeeding: boolean;
}

export function PortfolioManager({
  onSeedDatabase,
  onNavigateToSection,
  isSeeding,
}: PortfolioManagerProps) {
  const portfolioSections = [
    {
      id: "projects",
      title: "Projects",
      description: "Manage your portfolio projects across all languages",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      id: "skills",
      title: "Skills",
      description: "Add and organize your technical skills",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      id: "experience",
      title: "Experience & Education",
      description: "View and manage work experience and education",
      icon: <Briefcase className="h-5 w-5" />,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      id: "profile",
      title: "Profile",
      description: "Manage personal information and contact details",
      icon: <Users className="h-5 w-5" />,
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio data with GraphQL
          </p>
        </div>
        <Button
          onClick={onSeedDatabase}
          disabled={isSeeding}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          {isSeeding ? "Seeding..." : "Seed Database"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span>GraphQL Status</span>
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            GraphQL endpoint:{" "}
            <code className="bg-muted px-1 py-0.5 rounded">/api/graphql</code>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            You can now add, update, and delete portfolio items using the
            GraphQL API.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioSections.map((section) => (
          <Card
            key={section.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${section.color}`}>
                  {section.icon}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onNavigateToSection(section.id)}
                  className="flex items-center gap-1"
                >
                  <span>Manage</span>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="font-semibold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToSection("projects")}
            >
              Add Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToSection("skills")}
            >
              Add Skill
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToSection("experience")}
            >
              View Experience
            </Button>
          </div>
        </CardContent>
      </Card>

      <PortfolioOverview />
    </div>
  );
}

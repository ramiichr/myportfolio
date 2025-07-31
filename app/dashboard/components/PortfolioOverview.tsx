import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SKILLS, GET_PROJECTS } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Settings,
  Users,
  Briefcase,
  Database,
  Globe,
} from "lucide-react";

export function PortfolioOverview() {
  const { data: skillsData } = useQuery(GET_SKILLS);
  const { data: projectsEN } = useQuery(GET_PROJECTS, {
    variables: { language: "en" },
  });
  const { data: projectsDE } = useQuery(GET_PROJECTS, {
    variables: { language: "de" },
  });
  const { data: projectsFR } = useQuery(GET_PROJECTS, {
    variables: { language: "fr" },
  });

  const skills = skillsData?.skills || [];
  const totalProjects = projectsEN?.projects?.length || 0;
  const featuredProjects =
    projectsEN?.projects?.filter((p: any) => p.featured)?.length || 0;

  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: `${featuredProjects} featured`,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Skills",
      value: skills.length,
      description: `${Object.keys(skillsByCategory).length} categories`,
      icon: <Settings className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Languages",
      value: 3,
      description: "EN, DE, FR support",
      icon: <Globe className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      title: "Database",
      value: "SQLite",
      description: "GraphQL API active",
      icon: <Database className="h-5 w-5" />,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
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
      </div>

      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {category}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">
                    {count as number} skills
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {totalProjects > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(projectsEN?.projects || []).slice(0, 3).map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.category}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {project.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    <Badge variant="outline">{project.tags.length} tags</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

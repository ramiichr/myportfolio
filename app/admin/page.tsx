"use client";

import { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProjectManager from "./components/ProjectManager";
import SkillManager from "./components/SkillManager";
import ExperienceManager from "./components/ExperienceManager";
import ProfileManager from "./components/ProfileManager";

export default function AdminPage() {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Database seeded successfully!");
      } else {
        toast.error("Failed to seed database: " + data.message);
      }
    } catch (error) {
      toast.error("Error seeding database");
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Portfolio Admin</h1>
              <p className="text-muted-foreground mt-2">
                Manage your portfolio data with GraphQL
              </p>
            </div>
            <Button
              onClick={seedDatabase}
              disabled={isSeeding}
              variant="outline"
            >
              {isSeeding ? "Seeding..." : "Seed Database"}
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>GraphQL Status</span>
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                GraphQL endpoint:{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  /api/graphql
                </code>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can now add, update, and delete portfolio items using the
                GraphQL API.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <ProjectManager />
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <SkillManager />
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
              <ExperienceManager />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <ProfileManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ApolloProvider>
  );
}

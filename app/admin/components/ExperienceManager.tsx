"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPERIENCES } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Experience {
  id: string;
  experienceId: string;
  position: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  order: number;
}

export default function ExperienceManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const { data, loading } = useQuery(GET_EXPERIENCES, {
    variables: { language: selectedLanguage },
  });

  const experiences: Experience[] = data?.experiences || [];

  if (loading) return <div>Loading experiences...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Experience</h2>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{experience.position}</CardTitle>
                  <p className="text-lg text-muted-foreground">
                    {experience.company}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{experience.period}</Badge>
                    <Badge variant="outline">{experience.location}</Badge>
                  </div>
                </div>
                <Badge>Order: {experience.order}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {experience.description.map((desc, index) => (
                  <li key={index} className="text-sm">
                    {desc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Experience editing functionality will be implemented in the next
            iteration. Currently showing read-only view of existing experiences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

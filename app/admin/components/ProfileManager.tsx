"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export default function ProfileManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const { data, loading } = useQuery(GET_PROFILE, {
    variables: { language: selectedLanguage },
  });

  const profile: Profile = data?.profile;

  if (loading) return <div>Loading profile...</div>;

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Profile Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No profile data found for language: {selectedLanguage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Profile</h2>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {profile.name}
            <Badge variant="secondary">{selectedLanguage.toUpperCase()}</Badge>
          </CardTitle>
          <p className="text-lg text-muted-foreground">{profile.title}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {profile.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Location:</strong> {profile.location}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Social Links</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {profile.github}
                  </a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {profile.linkedin}
                  </a>
                </p>
                <p>
                  <strong>Twitter:</strong>{" "}
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {profile.twitter}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Profile editing functionality will be implemented in the next
            iteration. Currently showing read-only view of existing profile
            data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

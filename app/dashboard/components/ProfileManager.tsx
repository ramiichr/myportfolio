"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROFILE } from "@/lib/graphql/client";
import { usePortfolioData } from "@/components/portfolio-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { gql } from "@apollo/client";

// Profile mutations
const CREATE_PROFILE = gql`
  mutation CreateProfile($input: ProfileInput!) {
    createProfile(input: $input) {
      id
      language
      name
      title
      description
      email
      phone
      location
      github
      linkedin
      twitter
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: String!, $input: ProfileInput!) {
    updateProfile(id: $id, input: $input) {
      id
      language
      name
      title
      description
      email
      phone
      location
      github
      linkedin
      twitter
    }
  }
`;

const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: String!) {
    deleteProfile(id: $id)
  }
`;

interface Profile {
  id: string;
  language: string;
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

export function ProfileManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { triggerRefresh } = usePortfolioData();

  const { data, loading, refetch } = useQuery(GET_PROFILE, {
    variables: { language: selectedLanguage },
  });

  const [createProfile] = useMutation(CREATE_PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [deleteProfile] = useMutation(DELETE_PROFILE);

  const profile: Profile | null = data?.profile;

  const handleSave = async (profileData: Partial<Profile>) => {
    try {
      const input = {
        language: selectedLanguage,
        name: profileData.name || "",
        title: profileData.title || "",
        description: profileData.description || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        github: profileData.github || "",
        linkedin: profileData.linkedin || "",
        twitter: profileData.twitter || "",
      };

      if (editingProfile?.id) {
        await updateProfile({
          variables: { id: editingProfile.id, input },
        });
        toast.success("Profile updated successfully");
      } else {
        await createProfile({
          variables: { input },
        });
        toast.success("Profile created successfully");
      }

      setEditingProfile(null);
      setIsCreating(false);
      refetch();
      triggerRefresh(); // Trigger refresh for main portfolio page
    } catch (error) {
      toast.error("Error saving profile");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!profile?.id) return;

    try {
      await deleteProfile({
        variables: { id: profile.id },
      });
      toast.success("Profile deleted successfully");
      refetch();
      triggerRefresh(); // Trigger refresh for main portfolio page
    } catch (error) {
      toast.error("Error deleting profile");
      console.error(error);
    }
  };

  const ProfileForm = ({
    profile: formProfile,
    onSave,
    onCancel,
  }: {
    profile?: Partial<Profile>;
    onSave: (profile: Partial<Profile>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: formProfile?.name || "",
      title: formProfile?.title || "",
      description: formProfile?.description || "",
      email: formProfile?.email || "",
      phone: formProfile?.phone || "",
      location: formProfile?.location || "",
      github: formProfile?.github || "",
      linkedin: formProfile?.linkedin || "",
      twitter: formProfile?.twitter || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {formProfile?.id ? "Edit Profile" : "Create Profile"}
            <Badge variant="secondary">{selectedLanguage.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Professional Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Frontend Developer"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Professional Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="A passionate developer with expertise in..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="New York, USA"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    GitHub
                  </label>
                  <Input
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    placeholder="https://github.com/username"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Twitter className="h-3 w-3" />
                    Twitter
                  </label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData({ ...formData, twitter: e.target.value })
                    }
                    placeholder="https://twitter.com/username"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Management
          </h2>
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
        {!profile && !isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Profile
          </Button>
        )}
      </div>

      {isCreating && (
        <ProfileForm
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingProfile && (
        <ProfileForm
          profile={editingProfile}
          onSave={handleSave}
          onCancel={() => setEditingProfile(null)}
        />
      )}

      {profile && !editingProfile && !isCreating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {profile.name}
                  <Badge variant="secondary">
                    {selectedLanguage.toUpperCase()}
                  </Badge>
                </CardTitle>
                <p className="text-lg text-muted-foreground">{profile.title}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProfile(profile)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Professional Description
              </h4>
              <p className="text-sm text-muted-foreground">
                {profile.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-blue-500 hover:underline"
                    >
                      {profile.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-medium mb-3">Social Media</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Github className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">GitHub:</span>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.github}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">LinkedIn:</span>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.linkedin}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Twitter:</span>
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.twitter}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!profile && !isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No profile data found for language:{" "}
              <Badge variant="outline">{selectedLanguage.toUpperCase()}</Badge>
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Profile for {selectedLanguage.toUpperCase()}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

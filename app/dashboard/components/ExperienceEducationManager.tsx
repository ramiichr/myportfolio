"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_EXPERIENCES,
  GET_EDUCATION,
  CREATE_EXPERIENCE,
  UPDATE_EXPERIENCE,
  DELETE_EXPERIENCE,
  CREATE_EDUCATION,
  UPDATE_EDUCATION,
  DELETE_EDUCATION,
} from "@/lib/graphql/client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

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

interface Education {
  id: string;
  educationId: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string[];
  order: number;
}

export function ExperienceEducationManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);
  const [isCreatingEducation, setIsCreatingEducation] = useState(false);
  const { triggerRefresh } = usePortfolioData();

  const {
    data: experienceData,
    loading: loadingExp,
    error: errorExp,
    refetch: refetchExperiences,
  } = useQuery(GET_EXPERIENCES, {
    variables: { language: selectedLanguage },
    errorPolicy: "all",
  });

  const {
    data: educationData,
    loading: loadingEdu,
    error: errorEdu,
    refetch: refetchEducation,
  } = useQuery(GET_EDUCATION, {
    variables: { language: selectedLanguage },
    errorPolicy: "all",
  });

  const [createExperience] = useMutation(CREATE_EXPERIENCE, {
    errorPolicy: "all",
  });
  const [updateExperience] = useMutation(UPDATE_EXPERIENCE, {
    errorPolicy: "all",
  });
  const [deleteExperience] = useMutation(DELETE_EXPERIENCE, {
    errorPolicy: "all",
  });
  const [createEducation] = useMutation(CREATE_EDUCATION, {
    errorPolicy: "all",
  });
  const [updateEducation] = useMutation(UPDATE_EDUCATION, {
    errorPolicy: "all",
  });
  const [deleteEducation] = useMutation(DELETE_EDUCATION, {
    errorPolicy: "all",
  });

  const experiences: Experience[] = experienceData?.experiences || [];
  const education: Education[] = educationData?.educations || [];

  // Handle loading state
  if (loadingExp || loadingEdu) return <div>Loading...</div>;

  // Handle error state
  if (errorExp || errorEdu) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading experience and education data.
          </p>
          <div className="space-y-2">
            {errorExp && (
              <p className="text-sm text-red-600">
                Experience Error: {errorExp.message}
              </p>
            )}
            {errorEdu && (
              <p className="text-sm text-red-600">
                Education Error: {errorEdu.message}
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              refetchExperiences();
              refetchEducation();
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveExperience = async (experience: Partial<Experience>) => {
    try {
      const input = {
        language: selectedLanguage,
        experienceId: experience.experienceId || "",
        position: experience.position || "",
        company: experience.company || "",
        period: experience.period || "",
        location: experience.location || "",
        description: experience.description || [],
        order: experience.order || 0,
      };

      if (editingExperience?.id) {
        await updateExperience({
          variables: { id: editingExperience.id, input },
        });
        toast.success("Experience updated successfully");
      } else {
        await createExperience({
          variables: { input },
        });
        toast.success("Experience created successfully");
      }

      setEditingExperience(null);
      setIsCreatingExperience(false);
      refetchExperiences();
      triggerRefresh();
    } catch (error) {
      toast.error("Error saving experience");
      console.error(error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience({
        variables: { id },
      });
      toast.success("Experience deleted successfully");
      refetchExperiences();
      triggerRefresh();
    } catch (error) {
      toast.error("Error deleting experience");
      console.error(error);
    }
  };

  const handleSaveEducation = async (edu: Partial<Education>) => {
    try {
      const input = {
        language: selectedLanguage,
        educationId: edu.educationId || "",
        degree: edu.degree || "",
        institution: edu.institution || "",
        period: edu.period || "",
        location: edu.location || "",
        description: edu.description || [],
        order: edu.order || 0,
      };

      if (editingEducation?.id) {
        await updateEducation({
          variables: { id: editingEducation.id, input },
        });
        toast.success("Education updated successfully");
      } else {
        await createEducation({
          variables: { input },
        });
        toast.success("Education created successfully");
      }

      setEditingEducation(null);
      setIsCreatingEducation(false);
      refetchEducation();
      triggerRefresh();
    } catch (error) {
      toast.error("Error saving education");
      console.error(error);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteEducation({
        variables: { id },
      });
      toast.success("Education deleted successfully");
      refetchEducation();
      triggerRefresh();
    } catch (error) {
      toast.error("Error deleting education");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Experience & Education</h2>
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

      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience ({experiences.length})
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education ({education.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsCreatingExperience(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>

          <div className="grid gap-4">
            {isCreatingExperience && (
              <ExperienceForm
                experience={null}
                onSave={handleSaveExperience}
                onCancel={() => setIsCreatingExperience(false)}
              />
            )}

            {experiences.map((experience) => (
              <div key={experience.id}>
                {editingExperience?.id === experience.id ? (
                  <ExperienceForm
                    experience={experience}
                    onSave={handleSaveExperience}
                    onCancel={() => setEditingExperience(null)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            {experience.position}
                          </CardTitle>
                          <p className="text-lg text-muted-foreground">
                            {experience.company}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">
                              {experience.period}
                            </Badge>
                            <Badge variant="outline">
                              {experience.location}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Order: {experience.order}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingExperience(experience)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteExperience(experience.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsCreatingEducation(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>

          <div className="grid gap-4">
            {isCreatingEducation && (
              <EducationForm
                education={null}
                onSave={handleSaveEducation}
                onCancel={() => setIsCreatingEducation(false)}
              />
            )}

            {education.map((edu) => (
              <div key={edu.id}>
                {editingEducation?.id === edu.id ? (
                  <EducationForm
                    education={edu}
                    onSave={handleSaveEducation}
                    onCancel={() => setEditingEducation(null)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {edu.degree}
                          </CardTitle>
                          <p className="text-lg text-muted-foreground">
                            {edu.institution}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{edu.period}</Badge>
                            <Badge variant="outline">{edu.location}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Order: {edu.order}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingEducation(edu)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {edu.description.map((desc, index) => (
                          <li key={index} className="text-sm">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Experience Form Component
function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: {
  experience: Experience | null;
  onSave: (experience: Partial<Experience>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    experienceId: experience?.experienceId || "",
    position: experience?.position || "",
    company: experience?.company || "",
    period: experience?.period || "",
    location: experience?.location || "",
    description: experience?.description || [],
    order: experience?.order || 0,
  });

  const [descriptionText, setDescriptionText] = useState(
    experience?.description?.join("\n") || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = descriptionText
      .split("\n")
      .filter((line) => line.trim());
    onSave({ ...formData, description });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {experience ? "Edit Experience" : "Add New Experience"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Experience ID</label>
              <Input
                value={formData.experienceId}
                onChange={(e) =>
                  setFormData({ ...formData, experienceId: e.target.value })
                }
                placeholder="unique-experience-id"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Position</label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company</label>
            <Input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Company Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Period</label>
              <Input
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                placeholder="2023 - Present"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Description (one line per bullet point)
            </label>
            <Textarea
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Improved application performance by 30%"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
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
}

// Education Form Component
function EducationForm({
  education,
  onSave,
  onCancel,
}: {
  education: Education | null;
  onSave: (education: Partial<Education>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    educationId: education?.educationId || "",
    degree: education?.degree || "",
    institution: education?.institution || "",
    period: education?.period || "",
    location: education?.location || "",
    description: education?.description || [],
    order: education?.order || 0,
  });

  const [descriptionText, setDescriptionText] = useState(
    education?.description?.join("\n") || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = descriptionText
      .split("\n")
      .filter((line) => line.trim());
    onSave({ ...formData, description });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {education ? "Edit Education" : "Add New Education"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Education ID</label>
              <Input
                value={formData.educationId}
                onChange={(e) =>
                  setFormData({ ...formData, educationId: e.target.value })
                }
                placeholder="unique-education-id"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Degree</label>
            <Input
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              placeholder="Master of Science in Computer Science"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Institution</label>
            <Input
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              placeholder="University Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Period</label>
              <Input
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                placeholder="2020 - 2022"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Description (one line per bullet point)
            </label>
            <Textarea
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="• Specialized in Software Engineering&#10;• Graduated with honors&#10;• Research focus on web technologies"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
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
}

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PROJECTS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
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
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  projectId: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  category: string;
  featured: boolean;
  order: number;
}

export function ProjectManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { triggerRefresh } = usePortfolioData();

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: { language: selectedLanguage },
  });

  const [createProject] = useMutation(CREATE_PROJECT);
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);

  const projects: Project[] = data?.projects || [];

  const handleSave = async (project: Partial<Project>) => {
    try {
      const input = {
        language: selectedLanguage,
        projectId: project.projectId || "",
        title: project.title || "",
        description: project.description || "",
        image: project.image || "",
        tags: project.tags || [],
        link: project.link || "",
        github: project.github || "",
        category: project.category || "web",
        featured: project.featured || false,
        order: project.order || 0,
      };

      if (editingProject?.id) {
        await updateProject({
          variables: { id: editingProject.id, input },
        });
        toast.success("Project updated successfully");
      } else {
        await createProject({
          variables: { input },
        });
        toast.success("Project created successfully");
      }

      setEditingProject(null);
      setIsCreating(false);
      refetch();
      triggerRefresh(); // Trigger refresh for main portfolio page
    } catch (error) {
      toast.error("Error saving project");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject({
        variables: { id },
      });
      toast.success("Project deleted successfully");
      refetch();
      triggerRefresh(); // Trigger refresh for main portfolio page
    } catch (error) {
      toast.error("Error deleting project");
      console.error(error);
    }
  };

  const ProjectForm = ({
    project,
    onSave,
    onCancel,
  }: {
    project?: Partial<Project>;
    onSave: (project: Partial<Project>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      projectId: project?.projectId || "",
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      tags: project?.tags?.join(", ") || "",
      link: project?.link || "",
      github: project?.github || "",
      category: project?.category || "web",
      featured: project?.featured || false,
      order: project?.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {project?.id ? "Edit Project" : "Create Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project ID</label>
                <Input
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  placeholder="unique-project-id"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Project Title"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Project description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/image.png"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="React, TypeScript, Node.js"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Live Link</label>
                <Input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://project.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">GitHub Link</label>
                <Input
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  placeholder="https://github.com/user/repo"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Projects</h2>
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
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isCreating && (
        <ProjectForm
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingProject && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => setEditingProject(null)}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    {project.featured && <Badge>Featured</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ID: {project.projectId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProject(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  Category: {project.category} • Order: {project.order}
                </p>
                <p>
                  Links:{" "}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Live
                  </a>{" "}
                  •{" "}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

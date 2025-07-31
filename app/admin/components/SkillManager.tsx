"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SKILLS,
  CREATE_SKILL,
  UPDATE_SKILL,
  DELETE_SKILL,
} from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  order: number;
}

export default function SkillManager() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data, loading, refetch } = useQuery(GET_SKILLS);
  const [createSkill] = useMutation(CREATE_SKILL);
  const [updateSkill] = useMutation(UPDATE_SKILL);
  const [deleteSkill] = useMutation(DELETE_SKILL);

  const skills: Skill[] = data?.skills || [];

  const handleSave = async (skill: Partial<Skill>) => {
    try {
      const input = {
        name: skill.name || "",
        icon: skill.icon || "",
        category: skill.category || "frontend",
        order: skill.order || 0,
      };

      if (editingSkill?.id) {
        await updateSkill({
          variables: { id: editingSkill.id, input },
        });
        toast.success("Skill updated successfully");
      } else {
        await createSkill({
          variables: { input },
        });
        toast.success("Skill created successfully");
      }

      setEditingSkill(null);
      setIsCreating(false);
      refetch();
    } catch (error) {
      toast.error("Error saving skill");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill({
        variables: { id },
      });
      toast.success("Skill deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting skill");
      console.error(error);
    }
  };

  const SkillForm = ({
    skill,
    onSave,
    onCancel,
  }: {
    skill?: Partial<Skill>;
    onSave: (skill: Partial<Skill>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: skill?.name || "",
      icon: skill?.icon || "",
      category: skill?.category || "frontend",
      order: skill?.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{skill?.id ? "Edit Skill" : "Create Skill"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="React"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <Input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="reactjs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
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

  if (loading) return <div>Loading skills...</div>;

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {isCreating && (
        <SkillForm onSave={handleSave} onCancel={() => setIsCreating(false)} />
      )}

      {editingSkill && (
        <SkillForm
          skill={editingSkill}
          onSave={handleSave}
          onCancel={() => setEditingSkill(null)}
        />
      )}

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{skill.icon}</Badge>
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({skill.order})
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSkill(skill)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

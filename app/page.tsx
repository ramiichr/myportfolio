"use client";

import { useLanguage } from "@/components/language-provider";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useDataFetch } from "@/hooks/use-data-fetch";
import { getProfile, getProjects, getSkills } from "@/lib/api";
import { LoadingSpinner } from "@/components/common";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Profile, Project, Skill } from "@/types";
import {
  HeroSection,
  SkillsSection,
  ProjectsSection,
  ContactCTASection,
} from "@/components/sections/home";

export default function Home() {
  const { translations, language } = useLanguage();
  const { calculateMovement } = useMousePosition();

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useDataFetch<Profile>(() => getProfile(language), [language]);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useDataFetch<Project[]>(
    () => getProjects(language, undefined, true),
    [language]
  );

  const {
    data: skills,
    loading: skillsLoading,
    error: skillsError,
  } = useDataFetch<Skill[]>(() => getSkills(), []);

  const isLoading = profileLoading || projectsLoading || skillsLoading;
  const hasError = profileError || projectsError || skillsError;

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (hasError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {hasError.message ||
            "Failed to load content. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-16 pt-4">
      <HeroSection
        profile={profile}
        translations={translations}
        calculateMovement={calculateMovement}
      />
      <SkillsSection skills={skills || []} translations={translations} />
      <ProjectsSection projects={projects || []} translations={translations} />
      <ContactCTASection translations={translations} />
    </div>
  );
}

"use client";

import { Suspense } from "react";
import { useLanguage } from "@/components/language-provider";
import { usePortfolioData } from "@/components/portfolio-data-provider";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useDataFetch } from "@/hooks/use-data-fetch";
import { getProfile, getProjects, getSkills } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Profile, Project, Skill } from "@/types";
import {
  HeroSection,
  SkillsSection,
  ProjectsSection,
  ContactCTASection,
} from "@/components/sections/home";

// Loading placeholders to prevent text flash
const LoadingHeroSection = () => (
  <section className="relative min-h-[90vh] py-16 md:py-0 flex items-center justify-center overflow-hidden">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-0">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-20">
          <div className="h-16 bg-muted-foreground/10 rounded animate-pulse"></div>
          <div className="h-8 bg-muted-foreground/10 rounded animate-pulse"></div>
          <div className="h-24 bg-muted-foreground/10 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  const { translations, language } = useLanguage();
  const { refreshTrigger } = usePortfolioData();
  const { calculateMovement } = useMousePosition();

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useDataFetch<Profile>(
    () => getProfile(language),
    [language, refreshTrigger]
  );

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useDataFetch<Project[]>(
    () => getProjects(language, undefined, true),
    [language, refreshTrigger]
  );

  const {
    data: skills,
    loading: skillsLoading,
    error: skillsError,
  } = useDataFetch<Skill[]>(() => getSkills(), [refreshTrigger]);

  const hasError = profileError || projectsError || skillsError;

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
    <main className="mt-16 pt-4">
      <Suspense fallback={<LoadingHeroSection />}>
        {profileLoading ? (
          <LoadingHeroSection />
        ) : (
          <HeroSection
            profile={profile}
            translations={translations}
            calculateMovement={calculateMovement}
          />
        )}
      </Suspense>
      <SkillsSection skills={skills || []} translations={translations} />
      <ProjectsSection projects={projects || []} translations={translations} />
      <ContactCTASection translations={translations} />
    </main>
  );
}

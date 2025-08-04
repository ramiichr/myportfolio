"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { fr } from "@/i18n/fr";

type Language = "en" | "de" | "fr";
interface Translations {
  navigation: {
    home: string;
    about: string;
    projects: string;
    github: string;
    contact: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    description: string;
    cta: string;
  };
  about: {
    backend: ReactNode;
    frontend: ReactNode;
    education: ReactNode;
    experience: ReactNode;
    skills: ReactNode;
    title: string;
    description: string;
    tools: string;
  };
  projects: {
    title: string;
    description: string;
    viewProject: string;
    viewCode: string;
    categories: {
      all: string;
      web: string;
      mobile: string;
    };
  };
  skills: {
    viewAll: string;
    frontend: string;
    backend: string;
    tools: string;
  };
  github: {
    title: string;
    description: string;
    contributionsTitle: string;
    commitsTitle: string;
    stats: {
      repositories: string;
      stars: string;
      forks: string;
      followers: string;
    };
    sections: {
      languages: string;
      activity: string;
      commits: string;
    };
    commits: {
      viewCommit: string;
      viewProfile: string;
      viewAllRepos: string;
      noCommits: string;
      timeAgo: {
        justNow: string;
        minutesAgo: string;
        hoursAgo: string;
        daysAgo: string;
        weeksAgo: string;
        monthsAgo: string;
        yearsAgo: string;
      };
      repository: string;
      author: string;
    };
  };
  contact: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendButton: string;
    success: string;
    error: string;
    cta: string;
    email: string;
    phone: string;
    location: string;
    formTitle: string;
    formDescription: string;
  };
  footer: {
    name: string;
    rights: string;
  };
  theme: any;
  language: any;
}

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const preloadedTranslations = {
  en,
  de,
  fr,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>(en);

  useEffect(() => {
    setMounted(true);
    // Load saved language preference from localStorage if available
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "de", "fr"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      setTranslations(preloadedTranslations[savedLanguage]);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "de" || browserLang === "fr") {
        setLanguage(browserLang as Language);
        setTranslations(preloadedTranslations[browserLang as Language]);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Update translations when language changes
    setTranslations(preloadedTranslations[language]);
    // Save language preference
    localStorage.setItem("language", language);
  }, [language, mounted]);

  // During SSR and initial hydration, always use English to prevent mismatch
  const contextValue = {
    language: mounted ? language : ("en" as Language),
    translations: mounted ? translations : en,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

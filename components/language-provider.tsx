"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { en } from "@/i18n/en"
import { de } from "@/i18n/de"

type Language = "en" | "de"
type Translations = typeof en

interface LanguageContextType {
  language: Language
  translations: Translations
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    // Load saved language preference from localStorage if available
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "de")) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "de") {
        setLanguage("de")
      }
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "en" ? en : de)
    // Save language preference
    localStorage.setItem("language", language)
  }, [language])

  return <LanguageContext.Provider value={{ language, translations, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}


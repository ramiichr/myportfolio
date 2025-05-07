"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage, translations } = useLanguage();

  const handleLanguageChange = (newLang: "en" | "de" | "fr") => {
    const root = document.querySelector("[data-language]");
    root?.setAttribute("data-language-switching", "true");

    setTimeout(() => {
      setLanguage(newLang);
      root?.removeAttribute("data-language-switching");
    }, 200);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`${language === "en" ? "bg-accent" : ""} py-2.5`}
        >
          <span className="flex items-center gap-3 w-full">
            <span className="flex justify-center items-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-bold">
              EN
            </span>
            <span className="flex-grow">{translations.language.en}</span>
            {language === "en" && (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            )}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("de")}
          className={`${language === "de" ? "bg-accent" : ""} py-2.5`}
        >
          <span className="flex items-center gap-3 w-full">
            <span className="flex justify-center items-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full text-xs font-bold">
              DE
            </span>
            <span className="flex-grow">{translations.language.de}</span>
            {language === "de" && (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            )}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("fr")}
          className={`${language === "fr" ? "bg-accent" : ""} py-2.5`}
        >
          <span className="flex items-center gap-3 w-full">
            <span className="flex justify-center items-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs font-bold">
              FR
            </span>
            <span className="flex-grow">{translations.language.fr}</span>
            {language === "fr" && (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            )}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

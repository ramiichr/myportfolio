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
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          <span>{translations.language.en}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("de")}
          className={language === "de" ? "bg-accent" : ""}
        >
          <span>{translations.language.de}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("fr")}
          className={language === "fr" ? "bg-accent" : ""}
        >
          <span>{translations.language.fr}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { useThemeShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  Laptop,
  Palette,
  Settings,
  Globe,
  Check,
} from "lucide-react";

type ColorTheme = "blue" | "green" | "purple" | "rose" | "orange";
type Language = "en" | "de" | "fr";

const colorThemes: { name: ColorTheme; label: string }[] = [
  { name: "blue", label: "Blue" },
  { name: "green", label: "Green" },
  { name: "purple", label: "Purple" },
  { name: "rose", label: "Rose" },
  { name: "orange", label: "Orange" },
];

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const COLOR_THEME_KEY = "color-theme";

export function SettingsToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, translations } = useLanguage();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");

  // Initialize theme synchronously if possible
  useEffect(() => {
    const savedColorTheme =
      (localStorage.getItem(COLOR_THEME_KEY) as ColorTheme) || "blue";
    // Apply theme immediately on mount
    setColorTheme(savedColorTheme);
    document.documentElement.setAttribute("data-theme", savedColorTheme);
    setMounted(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COLOR_THEME_KEY) {
        const newTheme = (e.newValue as ColorTheme) || "blue";
        setColorTheme(newTheme);

        // Temporarily disable transitions for instant theme change
        document.documentElement.classList.add("theme-switching");
        document.documentElement.setAttribute("data-theme", newTheme);

        // Re-enable transitions after a minimal delay
        setTimeout(() => {
          document.documentElement.classList.remove("theme-switching");
        }, 10);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme);
    localStorage.setItem(COLOR_THEME_KEY, newColorTheme);

    // Temporarily disable transitions for instant theme change
    document.documentElement.classList.add("theme-switching");
    document.documentElement.setAttribute("data-theme", newColorTheme);

    // Re-enable transitions after a minimal delay
    setTimeout(() => {
      document.documentElement.classList.remove("theme-switching");
    }, 10);
  };

  const handleLanguageChange = (newLang: Language) => {
    const root = document.querySelector("[data-language]");
    root?.setAttribute("data-language-switching", "true");

    setTimeout(() => {
      setLanguage(newLang);
      root?.removeAttribute("data-language-switching");
    }, 200);
  };

  // Keyboard shortcuts
  const toggleTheme = () => {
    const themes = ["light", "dark", "system"] as const;
    const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);

    toast({
      title: "Theme changed",
      description: `Switched to ${themes[nextIndex]} theme`,
      duration: 2000,
    });
  };

  const nextColorTheme = () => {
    const currentIndex = colorThemes.findIndex((t) => t.name === colorTheme);
    const nextIndex = (currentIndex + 1) % colorThemes.length;
    handleColorThemeChange(colorThemes[nextIndex].name);

    toast({
      title: "Color theme changed",
      description: `Switched to ${colorThemes[nextIndex].label} color`,
      duration: 2000,
    });
  };

  const nextLanguage = () => {
    const currentIndex = languages.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    handleLanguageChange(languages[nextIndex].code);

    toast({
      title: "Language changed",
      description: `Switched to ${languages[nextIndex].label}`,
      duration: 2000,
    });
  };

  useThemeShortcuts(toggleTheme, nextColorTheme, nextLanguage);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="transition-none">
        <Settings className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Open settings</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-medium flex items-center justify-between">
          {translations.theme?.label || "Theme"}
          <span className="text-xs text-muted-foreground">Ctrl+Alt+R</span>
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span className="flex-1">{translations.theme.light}</span>
          {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span className="flex-1">{translations.theme.dark}</span>
          {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent" : ""}
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span className="flex-1">{translations.theme.system}</span>
          {theme === "system" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="font-medium flex items-center justify-between">
          {translations.theme?.colorLabel || "Colors"}
          <span className="text-xs text-muted-foreground">Ctrl+Alt+C</span>
        </DropdownMenuLabel>
        {colorThemes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => handleColorThemeChange(themeOption.name)}
            className={colorTheme === themeOption.name ? "bg-accent" : ""}
          >
            <Palette
              className="mr-2 h-4 w-4"
              style={{
                color:
                  themeOption.name === "blue"
                    ? "hsl(221.2 83.2% 53.3%)"
                    : themeOption.name === "green"
                      ? "hsl(142.1 76.2% 36.3%)"
                      : themeOption.name === "purple"
                        ? "hsl(262.1 83.3% 57.8%)"
                        : themeOption.name === "rose"
                          ? "hsl(346.8 77.2% 49.8%)"
                          : "hsl(24.6 95% 53.1%)", // orange
              }}
            />
            <span className="flex-1">
              {translations.theme.colors[themeOption.name]}
            </span>
            {colorTheme === themeOption.name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="font-medium flex items-center justify-between">
          {translations.language?.label || "Language"}
          <span className="text-xs text-muted-foreground">Ctrl+Alt+L</span>
        </DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <Globe className="mr-2 h-4 w-4" />
            <span className="mr-2">{lang.flag}</span>
            <span className="flex-1">{translations.language[lang.code]}</span>
            {language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

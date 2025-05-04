"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Laptop, Palette } from "lucide-react";

type ColorTheme = "blue" | "green" | "purple" | "rose" | "orange";

const colorThemes: { name: ColorTheme; label: string }[] = [
  { name: "blue", label: "Blue" },
  { name: "green", label: "Green" },
  { name: "purple", label: "Purple" },
  { name: "rose", label: "Rose" },
  { name: "orange", label: "Orange" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { translations } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState("blue");

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Get the initial color theme from data-theme attribute
    const initialColorTheme =
      document.documentElement.getAttribute("data-theme") || "blue";
    setColorTheme(initialColorTheme);
  }, []);

  // Handle theme changes
  const handleColorThemeChange = (newColorTheme: string) => {
    setColorTheme(newColorTheme);
    document.documentElement.setAttribute("data-theme", newColorTheme);
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Laptop className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>{translations.theme.light}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>{translations.theme.dark}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent" : ""}
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>{translations.theme.system}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {colorThemes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.name}
            onClick={() => handleColorThemeChange(themeOption.name)}
            className={colorTheme === themeOption.name ? "bg-accent" : ""}
          >
            <Palette
              className="mr-2 h-4 w-4"
              style={{ color: `hsl(var(--primary))` }}
            />
            <span>{translations.theme.colors[themeOption.name]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

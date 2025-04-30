"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "./NavigationMenu";
import { MobileMenu } from "./MobileMenu";
import type { NavigationItem } from "./types";

export default function Header() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Don't render header on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const navigation: NavigationItem[] = [
    { name: translations.navigation.home, href: "/" },
    { name: translations.navigation.about, href: "/about" },
    { name: translations.navigation.projects, href: "/projects" },
    { name: translations.navigation.contact, href: "/contact" },
  ];

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMobileItemClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              <span className="font-caveat text-2xl">Rami Cheikh Rouhou</span>
            </Link>
          </div>

          <NavigationMenu items={navigation} activePath={pathname} />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <MobileMenu
          isOpen={menuOpen}
          items={navigation}
          onItemClick={handleMobileItemClick}
          activePath={pathname}
        />
      </div>
    </header>
  );
}

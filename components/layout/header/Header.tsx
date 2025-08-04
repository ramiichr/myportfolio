"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SettingsToggle } from "@/components/settings-toggle";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "./NavigationMenu";
import { MobileMenu } from "./MobileMenu";
import type { NavigationItem } from "./types";

export default function Header() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMobileItemClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Don't render header on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  // Use default navigation during SSR/hydration to prevent mismatch
  const defaultNavigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "GitHub", href: "/github" },
    { name: "Contact", href: "/contact" },
  ];

  const navigation: NavigationItem[] = mounted
    ? [
        { name: translations.navigation.home, href: "/" },
        { name: translations.navigation.about, href: "/about" },
        { name: translations.navigation.projects, href: "/projects" },
        { name: translations.navigation.github, href: "/github" },
        { name: translations.navigation.contact, href: "/contact" },
      ]
    : defaultNavigation;

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div
        className="mx-auto max-w-7xl"
        style={{
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          paddingLeft: isMobile ? "1rem" : "1.5rem",
          paddingRight: isMobile ? "1rem" : "1.5rem",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              <span className="font-caveat text-2xl">Rami Cheikh Rouhou</span>
            </Link>
          </div>

          <NavigationMenu items={navigation} activePath={pathname} />

          <div className="flex items-center gap-4">
            <SettingsToggle />

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

"use client";

import Link from "next/link";
import { memo } from "react";
import type { NavigationItem } from "./types";

interface NavigationMenuProps {
  items: NavigationItem[];
  activePath: string;
}

export const NavigationMenu = memo(function NavigationMenu({
  items,
  activePath,
}: NavigationMenuProps) {
  return (
    <nav className="hidden md:flex md:items-center md:space-x-8">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`relative px-2 py-4 text-sm font-medium transition-colors hover:text-primary nav-item ${
            activePath === item.href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
});

"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NavigationItem } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  items: NavigationItem[];
  onItemClick: () => void;
  activePath: string;
}

const MobileMenu = memo(function MobileMenu({
  isOpen,
  items,
  onItemClick,
  activePath,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute top-full left-0 right-0 bg-background/80 backdrop-blur-sm border-b md:hidden overflow-hidden"
        >
          <nav className="flex flex-col max-w-7xl mx-auto px-6">
            {items.map((item) => (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`block w-full text-base font-medium py-4 px-2 transition-all hover:translate-x-1 hover:text-primary mobile-nav-item ${
                    activePath === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={onItemClick}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export { MobileMenu };

import { useEffect } from "react";

type ShortcutHandler = () => void;

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          Boolean(s.ctrl) === event.ctrlKey &&
          Boolean(s.alt) === event.altKey &&
          Boolean(s.shift) === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// Predefined shortcuts for common theme actions
export function useThemeShortcuts(
  toggleTheme: () => void,
  nextColorTheme: () => void,
  nextLanguage: () => void
) {
  useKeyboardShortcuts([
    {
      key: "r",
      ctrl: true,
      alt: true,
      handler: toggleTheme,
    },
    {
      key: "c",
      ctrl: true,
      alt: true,
      handler: nextColorTheme,
    },
    {
      key: "l",
      ctrl: true,
      alt: true,
      handler: nextLanguage,
    },
  ]);
}

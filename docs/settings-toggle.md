# Unified Settings Toggle

This implementation provides a unified settings toggle that combines theme, color, and language switching in a single dropdown interface, similar to modern application preferences.

## Features

### 🎨 Theme Management

- **Light/Dark/System mode switching** with visual indicators
- **Color theme selection** (Blue, Green, Purple, Rose, Orange)
- **Real-time theme application** with smooth transitions

### 🌍 Language Management

- **Multi-language support** (English, German, French)
- **Flag indicators** for visual language identification
- **Smooth language transitions** with loading states

### ⌨️ Keyboard Shortcuts

- **Ctrl+Alt+R**: Cycle through theme modes (Light → Dark → System)
- **Ctrl+Alt+C**: Cycle through color themes
- **Ctrl+Alt+L**: Cycle through languages

### 🔔 Toast Notifications

- **Visual feedback** for all keyboard shortcuts
- **Non-intrusive notifications** that don't disrupt workflow
- **Multilingual toast messages** that update based on current language

## Implementation Details

### Components

- **`SettingsToggle`**: Main unified toggle component
- **Removed**: Separate `LanguageToggle` component (now integrated)
- **Enhanced**: Settings icon instead of theme-specific icons for universal appeal

### Hooks

- **`useKeyboardShortcuts`**: Custom hook for keyboard shortcut management
- **`useThemeShortcuts`**: Predefined shortcuts for theme/language actions
- **Integration**: Works with existing `useTheme` and `useLanguage` hooks

### Persistence

- **Theme settings**: Stored in localStorage with `next-themes`
- **Color themes**: Stored in localStorage with custom key
- **Language settings**: Stored in localStorage with language provider
- **Sync across tabs**: Storage events handle cross-tab synchronization

### Accessibility

- **Keyboard navigation**: Full keyboard support for all options
- **Screen reader friendly**: Proper ARIA labels and semantic structure
- **Visual indicators**: Check marks show current selections
- **Focus management**: Proper focus handling in dropdown menus

## Usage

The settings toggle appears in the header and provides:

1. **Click interface**: Drop-down menu with organized sections
2. **Keyboard shortcuts**: Quick switching without opening menu
3. **Visual feedback**: Clear indication of current settings
4. **Toast notifications**: Confirmation of changes via keyboard

## Technical Implementation

### Unified State Management

```typescript
// All settings in one component
const { theme, setTheme } = useTheme();
const { language, setLanguage } = useLanguage();
const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
```

### Keyboard Shortcut Integration

```typescript
// Custom hook for keyboard shortcuts
useThemeShortcuts(toggleTheme, nextColorTheme, nextLanguage);
```

### Toast Integration

```typescript
// User feedback for keyboard actions
toast({
  title: "Theme changed",
  description: `Switched to ${newTheme} theme`,
  duration: 2000,
});
```

## Benefits

1. **Unified UX**: Single interface for all personalization settings
2. **Power user friendly**: Keyboard shortcuts for rapid switching
3. **Consistent patterns**: Same interaction model for all settings
4. **Reduced UI clutter**: One button instead of multiple toggles
5. **Enhanced accessibility**: Better keyboard navigation and screen reader support
6. **Modern design**: Settings gear icon is universally recognized

## Future Enhancements

- **Theme presets**: Save custom theme+language combinations
- **Auto-detection**: Smart language detection based on user location
- **Animation preferences**: Motion settings for accessibility
- **Font size controls**: Typography personalization options

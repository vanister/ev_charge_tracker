# Clean Eco Theme - Color Palette

## Overview
The EV Charge Tracker uses the **Clean Eco** theme - an environmental, calming color palette with ocean teal as the primary color, complemented by green and orange accents. Full dark/light mode support is included with smooth transitions.

## Core Colors

### Light Mode
- **Primary**: `#14b8a6` (teal-500) - Ocean Teal - Main brand color, CTAs, active states
- **Primary Hover**: `#0d9488` (teal-600) - Darker teal for hover states
- **Secondary**: `#22c55e` (green-500) - Forest Green - Secondary actions
- **Accent**: `#f97316` (orange-500) - Sunrise Orange - Highlights, alerts

### Dark Mode
- **Primary**: `#14b8a6` (teal-500) - Ocean Teal (same as light)
- **Primary Hover**: `#2dd4bf` (teal-400) - Lighter teal for hover states
- **Secondary**: `#22c55e` (green-500) - Forest Green (same as light)
- **Accent**: `#f97316` (orange-500) - Sunrise Orange (same as light)

## Location Colors

These colors categorize charging locations and remain consistent across themes:

- **Home** 🏠: `#14b8a6` (teal-500) - Teal
- **Work** 🏢: `#64748b` (slate-500) - Slate
- **Other** 📍: `#c084fc` (purple-400) - Purple
- **DC Fast Charger** ⚡: `#fb923c` (orange-400) - Orange

## Neutral Colors

### Light Mode
- **Background**: `#f9fafb` (gray-50) - Page background
- **Surface**: `#ffffff` (white) - Cards, header, navigation
- **Border**: `#e5e7eb` (gray-200) - Dividers, borders
- **Text Primary**: `#111827` (gray-900) - Headings, primary text
- **Text Secondary**: `#374151` (gray-700) - Secondary text
- **Text Tertiary**: `#4b5563` (gray-600) - Tertiary text
- **Text Muted**: `#6b7280` (gray-500) - Muted text, labels
- **Text Disabled**: `#9ca3af` (gray-400) - Disabled state

### Dark Mode
- **Background**: `#111827` (gray-900) - Page background
- **Surface**: `#1f2937` (gray-800) - Cards, header, navigation
- **Border**: `#374151` (gray-700) - Dividers, borders
- **Text Primary**: `#f9fafb` (gray-50) - Headings, primary text
- **Text Secondary**: `#e5e7eb` (gray-200) - Secondary text
- **Text Tertiary**: `#d1d5db` (gray-300) - Tertiary text
- **Text Muted**: `#9ca3af` (gray-400) - Muted text, labels
- **Text Disabled**: `#4b5563` (gray-600) - Disabled state

## Semantic CSS Classes

Use these classes throughout the app instead of hardcoded Tailwind colors:

### Backgrounds
- `.bg-background` - Page background
- `.bg-surface` - Cards, panels, navigation
- `.bg-primary` - Primary buttons, active states
- `.bg-primary-hover` - Hover state for primary elements

### Text
- `.text-primary` - Primary brand color
- `.text-secondary` - Secondary brand color
- `.text-accent` - Accent highlights
- `.text-body` - Primary body text
- `.text-body-secondary` - Secondary body text
- `.text-body-tertiary` - Tertiary body text
- `.text-muted` - Muted text, labels
- `.text-disabled` - Disabled state text

### Borders
- `.border-default` - Standard border color

## Theme Switching

Users can select from three theme modes:
1. **Light** - Always light theme
2. **Dark** - Always dark theme
3. **System** - Follows OS preference (default)

Theme preference is stored in IndexedDB and syncs across all open tabs automatically.

## Transitions

All color changes transition smoothly over 150ms with ease timing for a polished experience when switching themes.

## Implementation

- **CSS Variables**: Defined in `src/index.css` using Tailwind v4's `@theme` directive
- **Theme Provider**: `src/providers/ThemeProvider.tsx` manages theme state
- **Database Storage**: Theme preference stored in IndexedDB settings table
- **System Detection**: Listens to `prefers-color-scheme` media query
- **Root Attribute**: `data-theme="dark"` applied to `<html>` element in dark mode

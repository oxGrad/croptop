# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # Install dependencies
pnpm run dev      # Start dev server
pnpm run build    # Production build
```

## Architecture

This is a single-page React app (Vite + Tailwind CSS v4). It renders a **Profile Logo Cropper** tool.

**Entry point:** `src/main.tsx` → `src/app/App.tsx` → `src/app/components/ProfilePictureCropper.tsx`

**Key files:**

- `src/app/components/ProfilePictureCropper.tsx` — the main and only feature component. Manages crop state (position, zoom, rotation, shape) using `react-easy-crop`, live-previews the result via Canvas, and triggers PNG download.
- `src/app/utils/cropImage.ts` — Canvas utility that rotates/draws the image and returns a base64 PNG from pixel-crop coordinates.
- `src/app/components/ui/` — shadcn/ui component library (Radix UI primitives + Tailwind). Largely unused by the current single-component app but available for expansion.

**Styling:**

- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not PostCSS).
- `src/styles/theme.css` defines CSS custom properties for the design token system (colors, radii, sidebar, chart vars) and is imported by `src/styles/index.css`.
- `@` alias resolves to `src/`.

**No router, no state management library, no tests** are set up — this is a minimal single-screen tool.

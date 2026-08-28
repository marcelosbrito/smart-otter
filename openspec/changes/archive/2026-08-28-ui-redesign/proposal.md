# Proposal — UI Redesign (v0.3.1)

## Why

The current UI has several friction points: resource cards feel cramped with truncated explanations, the provider status indicator is visually disconnected from dev controls, and the app lacks a cohesive brand identity through color theming and iconography. These changes improve readability, consolidate header controls, establish distinct light/dark palettes, and add visual branding — all without altering backend behavior or data contracts.

## What Changes

- **Card height increase**: Resource cards expand from `h-[180px]` skeleton baseline to accommodate 4 lines of explanation text instead of 2 (`line-clamp-4`), improving readability of resource descriptions.
- **Status indicator relocation**: The live provider status widget (`SearchStatusWidget`) moves from below the search box into the dev drawer side panel, replacing its current standalone position on the search page.
- **Profession name header**: When results appear, display the profession name as a prominent `<h2>` heading (e.g., "Game Developer") above the category carousels, replacing the current subtle metadata line.
- **Otter icon + logo link**: Create a minimalistic square-format otter face SVG icon and place it to the left of the "Smart Otter" text in the header; clicking the combined logo+icon navigates to `/`.
- **Dark mode toggle repositioning**: Move the theme toggle from inside the left nav (between Search link and nothing) to the right-side header controls, positioned between the dev gear icon and the user avatar.
- **Light palette — Capuccino**: Replace current neutral light-mode CSS variables with a warm palette: Linen (`#f5f1ea`), Khaki (`#d7c9b8`), Camel (`#82967d`), Cocoa (`#7d5a44`), Espresso (`#4a342a`).
- **Dark palette — Aurora Borealis**: Replace current dark-mode CSS variables with a deep blue-green palette: `#061826`, `#0B2C3C`, `#D9FBFF`.
- **Version bump**: Increment package version from `0.3.0` to `0.3.1`.

## Capabilities

### New Capabilities
- `ui-themes`: Custom light (Capuccino) and dark (Aurora Borealis) color palettes replacing default shadcn neutral themes.

### Modified Capabilities
- `search-and-discover`: Card height, profession name display, status indicator location, header layout with otter icon and theme toggle repositioning.

## Impact

- **CSS**: `src/app/globals.css` — all light/dark theme color variables rewritten.
- **Components**: `src/components/search/ResourceCard.tsx` (height/text clamp), `src/components/auth/header.tsx` (logo+icon, theme toggle position), `src/components/search/SearchStatusWidget.tsx` (removed from search page, moved into dev drawer).
- **Pages**: `src/app/search/page.tsx` (profession heading, removed status widget import/usage).
- **Dev drawer**: `src/components/dev-drawer/DevDrawer.tsx` (add status indicator section).
- **Assets**: New otter face SVG icon file.
- **Config**: `package.json` version bump to `0.3.1`.
- No API route changes, no database schema changes, no auth flow changes.

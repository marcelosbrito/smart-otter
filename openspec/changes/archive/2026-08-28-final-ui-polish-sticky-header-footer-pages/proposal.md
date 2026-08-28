# Proposal: Final UI Polish — Sticky Header, Footer and Supporting Pages

## Why

Smart Otter is a functional product but lacks the finishing touches that make it feel like a complete, polished application. The header scrolls away on mobile, there is no footer to anchor the page layout, and the three internal links referenced in the design (Changelog, FAQ, Privacy) do not exist yet. Adding these elements closes the visual loop and gives the project portfolio-ready completeness without touching core functionality.

## What Changes

- **Sticky header with scroll transparency**: The existing site header becomes fixed at the top of the viewport. At scroll position 0 it retains its normal appearance; after scrolling it transitions to a semi-transparent, blurred background with subtle border and shadow.
- **Minimal footer**: A lightweight footer bar spans the bottom of every page containing the Smart Otter brand name, three internal links (Changelog, FAQ, Privacy), creator attribution linking to Marcelo Brito's GitHub, and three social/project icons (GitHub repository, X profile, LinkedIn profile).
- **Supporting pages**: Three new Next.js App Router pages at `/changelog`, `/faq`, and `/privacy` using the existing TASA Orbiter typography, Capuccino/Aurora color palettes, and shared layout.
- **Version bump**: Project version increments from `0.3.1` to `0.4.0`.

## Capabilities

### New Capabilities

- `sticky-header`: Sticky header with scroll-triggered translucent glass effect
- `footer-component`: Minimal global footer with brand, links, attribution and social icons
- `supporting-pages`: Changelog, FAQ (accordion), and Privacy pages sharing the application visual language

### Modified Capabilities

- `search-and-discover`: Header layout now includes sticky positioning; footer appears on all pages including search results. No behavioral change to search or AI logic.

## Impact

- **Modified files**: `src/app/layout.tsx` (add footer), `src/components/header/` (sticky behavior), new page files under `src/app/changelog/`, `src/app/faq/`, `src/app/privacy/`, `package.json` (version bump)
- **No changes to**: search API, AI provider logic, cache layer, authentication, favorites system, database schema, or existing dependencies
- **Dependencies**: No new packages installed; uses only existing Lucide icons and Tailwind CSS utilities

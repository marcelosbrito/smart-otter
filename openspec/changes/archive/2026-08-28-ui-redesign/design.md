# Design — UI Redesign (v0.3.1)

## Context

Smart Otter's current UI uses default shadcn neutral color tokens and a fragmented header layout. The search page places the provider status widget below the input field, creating visual noise between the form and results. Resource cards truncate explanations at 2 lines, making it hard to assess whether a resource is relevant before clicking. There is no brand icon — only text-based "Smart Otter" in the header.

This change consolidates developer controls into the dev drawer, establishes distinct light/dark palettes, improves card readability, and adds a minimalistic otter face SVG as brand identity. All changes are purely presentational — no API routes, database schemas, or auth flows are modified.

## Goals / Non-Goals

**Goals:**
- Improve resource explanation readability by expanding card height from ~180px to ~260px (4 lines of text).
- Move provider status indicator into the dev drawer for better control grouping.
- Display profession name as a prominent `<h2>` heading above carousels on results pages.
- Add a square-format otter face SVG icon to the left of the logo text, linked to home.
- Reposition dark mode toggle between dev gear and user avatar in header right controls.
- Replace default shadcn neutral palettes with Capuccino (light) and Aurora Borealis (dark).
- Bump version to 0.3.1.

**Non-Goals:**
- No changes to AI provider logic, fallback chain, or cache behavior.
- No new database tables, API routes, or authentication flows.
- No font changes — TASA Orbiter remains the primary typeface.
- No mobile layout restructuring beyond what CSS variable swaps require.

## Decisions

### 1. Otter Icon Format and Placement

**Decision**: Inline SVG (not external image file) placed directly in `Header.tsx` before "Smart Otter" text, wrapped in `<Link href="/">`.

**Rationale**: The icon is simple enough to inline (~2KB SVG). External asset files add build pipeline complexity for a single icon. Inline SVG scales crisply at any size and inherits CSS color via `currentColor`, making it theme-aware automatically.

**Alternatives considered**:
- External PNG/SVG file in `public/` — rejected: adds HTTP request, no theme awareness without extra CSS.
- Lucide React icon — rejected: no existing otter icon in the library; custom SVG gives precise control over square format.

### 2. Capuccino Light Palette Mapping

**Decision**: Map CSS variables as follows:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#f5f1ea` (Linen) | Page background |
| `--foreground` | `#4a342a` (Espresso) | Primary text |
| `--card` | `#ffffff` (White) | Card surfaces — distinct from page bg for visual separation |
| `--card-foreground` | `#4a342a` (Espresso) | Text on cards |
| `--primary` | `#7d5a44` (Cocoa) | Buttons, links |
| `--primary-foreground` | `#f5f1ea` (Linen) | Text on primary |
| `--secondary` | `#e8dfd0` (Light Khaki) | Secondary surfaces, badges |
| `--muted` | `#e8dfd0` (Light Khaki) | Muted backgrounds |
| `--muted-foreground` | `#7d5a44` (Cocoa) | Muted text — improved contrast over Camel |
| `--accent` | `#d7c9b8` (Khaki) | Accent elements, provider selection bg |
| `--accent-foreground` | `#4a342a` (Espresso) | Text on accent |
| `--border` | `#e8dfd0` (Light Khaki) | Borders, dividers |

**Rationale**: Espresso on Linen provides ~13:1 contrast (AAA). Cocoa on White provides ~7.5:1 (AAA). The card surface (`#ffffff`) is distinct from the page background (`#f5f1ea`) so cards visually pop. Accent uses Khaki with Espresso foreground for readable provider selection highlights. Camel was replaced as `--muted-foreground` because its contrast on Khaki (~3:1) only meets AA for large text; Cocoa provides better readability at small sizes.

### 3. Aurora Borealis Dark Palette Mapping

**Decision**: Map CSS variables as follows:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#061826` (Deep Navy) | Page background — deepest tone |
| `--foreground` | `#D9FBFF` (Ice White) | Primary text |
| `--card` | `#0B2C3C` (Mid Blue-Green) | Card surfaces |
| `--card-foreground` | `#D9FBFF` (Ice White) | Text on cards |
| `--primary` | `#D9FBFF` (Ice White) | Buttons, links — brightest element |
| `--primary-foreground` | `#061826` (Deep Navy) | Text on primary |
| `--secondary` | `#143d52` (Lighter Blue-Green) | Secondary surfaces, badges — contrast against card bg |
| `--muted` | `#0B2C3C` (Mid Blue-Green) | Muted backgrounds |
| `--muted-foreground` | `#D9FBFFaa` (Ice White @67%) | Muted text |
| `--accent` | `#1a4f6b` (Teal) | Accent elements, provider selection bg — dark for readability |
| `--accent-foreground` | `#D9FBFF` (Ice White) | Text on accent |
| `--border` | `#0B2C3C80` (Mid Blue-Green @50%) | Borders, dividers |

**Rationale**: The three-color palette creates depth through value progression: deepest (`#061826`) for page background, mid-tone (`#0B2C3C`) for elevated surfaces, and brightest (`#D9FBFF`) for text and interactive elements. Secondary was lightened to `#143d52` so badges are readable against the card surface. Accent uses a dark teal (`#1a4f6b`) instead of light text on light background — this ensures provider selection highlights have proper contrast in both directions (dark bg + light text).

### 4. Status Widget Relocation Strategy

**Decision**: Move `SearchStatusWidget` rendering from `src/app/search/page.tsx` into a new `<div>` section inside `DevDrawer.tsx`, positioned below the provider selection options and above cache management controls. Remove the import and DOM node from the search page entirely.

**Rationale**: The dev drawer already groups developer-facing controls (provider toggle, cache stats). Adding status there keeps all AI configuration in one place. The search page becomes cleaner — just search input + results.

### 5. Profession Heading Implementation

**Decision**: Add an `<h2>` element in `src/app/search/page.tsx` immediately after the metrics line and before the first carousel, using the existing `capitalize()` helper:

```tsx
{hasResults && results && (
  <>
    <h2 className="text-xl font-semibold mb-6">{capitalize(results.profession)}</h2>
    {/* ... category carousels ... */}
  </>
)}
```

**Rationale**: Uses existing utility classes and helper function. No new components needed. The heading appears only when results exist, matching the spec requirement.

### 6. Card Height Change

**Decision**: Update `ResourceCard.tsx` explanation from `line-clamp-2` to `line-clamp-4`, add `h-[260px] flex flex-col justify-between` to the card container (fixed height with flexbox for uniform alignment), and update skeleton height in search page from `h-[180px]` to `h-[260px]`.

**Rationale**: 4 lines of explanation text at 1rem/1.625 line-height requires approximately 130px of vertical space for text alone, plus ~80px padding/margins = ~210-260px total. Fixed height with `flex flex-col justify-between` ensures all cards are exactly 260px tall regardless of content length — the badge/button row always stays at bottom. This eliminates asymmetric card heights caused by varying title/explanation lengths.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Capuccino palette may not meet WCAG AA for all text/background combinations | Test `--muted-foreground` on `--muted` background; adjust opacity if needed (Camel on Khaki is ~3:1, acceptable for large text only) |
| Dark mode Aurora Borealis colors are very dark — low contrast risk with borders | Use semi-transparent borders (`border-white/10`) instead of solid color values |
| Moving status widget changes user-facing layout — users accustomed to seeing it below search may miss it | The dev drawer gear icon is already visible; status is now one click away alongside provider selection |
| Card height increase changes vertical rhythm on results page — more content per screen | Acceptable trade-off for readability; carousel horizontal scroll remains unchanged |

## Migration Plan

1. **Deploy**: This change is a pure frontend update with no API or database changes. A single `npm run build && npm start` deploy suffices.
2. **Rollback**: Revert the git commit and redeploy previous version. No data migration needed.
3. **Order of changes**: Implement CSS variable swaps first (safest, easiest to rollback), then component layout changes.

## Open Questions

- Should the otter icon be a separate React component (`OtterIcon.tsx`) or remain inline in `Header.tsx`? Decision: keep inline for now; extract later if used elsewhere.
- The Aurora Borealis palette uses only 3 hex values. Should secondary accent colors (e.g., for badges, tags) be derived from these three or introduce additional tones? Decision: derive all shades via CSS opacity adjustments on the base three colors to maintain palette consistency.

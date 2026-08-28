## Context

Smart Otter's search results page currently uses collapsible sections to display resources across four categories (Tools, Communities, Learning Platforms, Documentation). The data pipeline — AI service layer, cache, favorites, and provider selection — works correctly. The change is purely visual: the presentation layer needs a modern horizontal carousel layout with TASA Orbiter typography applied globally.

The existing `src/app/search/page.tsx` handles search form submission, loading states, error handling, metrics display, category filtering via URL parameters (`?category=tools`), and favorites management. The `NormalizedResponse` type and API contract must remain unchanged.

## Goals / Non-Goals

**Goals:**
- Replace collapsible resource sections with horizontal carousels for each of the four categories
- Each carousel has independent scroll, navigation arrows, and polished card components
- Apply TASA Orbiter font across all UI elements (headings, body text, buttons, cards)
- Ensure responsive behavior: desktop shows multiple cards, mobile supports swipe
- Maintain keyboard accessibility with meaningful aria-labels on all controls

**Non-Goals:**
- No changes to `/api/search`, AI response format, or cache implementation
- No new database schema or data model changes
- No modification of authentication, favorites logic, or provider selection
- No introduction of external carousel libraries or icon packages
- No mock data creation — only real resources from `results[cat.key]`

## Decisions

### Decision 1: Native CSS Scroll Carousel (No External Library)

**Choice:** Use native CSS `overflow-x: auto`, `scroll-behavior: smooth`, and `scrollBy()` for carousel navigation. Each category gets its own `useRef<HTMLDivElement>` scroll container.

**Rationale:** The project already has no carousel dependency, and the requirement explicitly prefers a simple implementation. Adding a library like Swiper or Embla would increase bundle size unnecessarily for four independent carousels with basic left/right controls. React refs + CSS scroll provide full functionality with zero dependencies.

**Alternatives considered:**
- **Embla Carousel**: Feature-rich but adds ~20KB gzipped; overkill for simple horizontal scroll with arrow buttons
- **Swiper**: Heavier (~35KB), more complex setup, not justified for this use case

### Decision 2: TASA Orbiter via Global CSS `@font-face` (Not next/font)

**Choice:** Define TASA Orbiter using `@font-face` in the global layout CSS file (`src/app/layout.tsx` or a dedicated CSS import). Load all four weights (400, 500, 600, 700) from the provided Google Fonts woff2 URLs. Apply via Tailwind's `fontFamily` configuration or inline style on root elements.

**Rationale:** TASA Orbiter is not available through `next/font` (which only supports Google Fonts that Next.js preloads). The font files are hosted on Google Fonts CDN, so a direct `@font-face` declaration in global CSS is the cleanest approach within the existing Next.js + Tailwind setup. This avoids adding a new font loader library.

**Alternatives considered:**
- **next/font wrapper**: Would require downloading and self-hosting font files; adds build complexity for no measurable benefit over CDN `@font-face`
- **Import from Google Fonts `<link>` tag in `<head>`**: Works but less explicit than `@font-face`; the CSS approach gives precise weight control

### Decision 3: Component Extraction for Carousel Sections

**Choice:** Extract `ResourceCategoryCarousel`, `CategoryHeader`, `ResourceCard`, and `ScrollButton` components from `SearchPage`. Keep `SearchForm` and `SearchMetrics` as-is since they are already separate.

**Rationale:** The search page is the primary file being modified. Extracting carousel-specific logic into focused components improves readability and makes future visual tweaks isolated to one module. `ResourceCard` encapsulates the favorite button, external link, and explanation text display.

### Decision 4: Card Design with Fixed Width + Equal Height

**Choice:** Cards use a fixed width (e.g., `w-[320px]`) with `flex-shrink-0` to prevent squishing. Cards within each carousel share equal height via CSS flexbox (`display: flex; gap: 1rem; flex-wrap: nowrap` on the scroll container, or explicit card height with text truncation). Explanation text is limited to two lines using `-webkit-line-clamp`.

**Rationale:** Fixed-width cards ensure consistent visual rhythm across carousels. Equal height prevents the "staircase" effect where cards of varying heights create misaligned rows. Text truncation keeps the design clean without sacrificing content access (users can click through for full details).

### Decision 5: Navigation Arrow Disabled State via Scroll Position Check

**Choice:** Each carousel's scroll buttons check `scrollLeft === 0` (disabled left) and `scrollLeft + clientWidth >= scrollWidth - 2` (disabled right, with small epsilon for floating point precision). Update disabled state on scroll events using a debounced handler or `scroll` event listener.

**Rationale:** This provides accurate visual feedback without complex intersection observers. The epsilon value (`- 2`) prevents edge-case flickering near boundaries due to sub-pixel rendering.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| TASA Orbiter font may not load if Google Fonts CDN is slow or blocked | Use `font-display: swap` in `@font-face`; provide a system font fallback stack |
| Mobile swipe conflicts with page scroll | Contain overflow strictly within carousel containers; use `overflow-x: auto` only on carousel wrappers, never on body/page |
| Card height variation due to explanation text length | Use `-webkit-line-clamp: 2` for explanation text; truncate with ellipsis; ensure cards have consistent minimum height via flexbox |
| Carousel scroll performance on low-end devices | Native CSS scroll is hardware-accelerated; avoid JS-driven scroll animations that cause layout thrashing |
| Font weight mismatch between TASA Orbiter and existing design tokens | Audit all heading/body/button text after font swap; adjust `font-weight` values in Tailwind config if needed |

## Migration Plan

This is a purely visual change with no data migration or deployment steps:

1. Implement carousel components and typography changes in a single PR
2. No database migrations, API changes, or environment variable updates required
3. Rollback: revert the commit — all existing functionality remains intact since no contracts changed

## Open Questions

- Should TASA Orbiter be applied to ALL text elements including code blocks, or only non-monospace UI? (Decision: Apply to all non-code text; preserve monospace for any inline code)
- Is there an existing global CSS file where `@font-face` declarations should live, or should they go in the layout component's style block?

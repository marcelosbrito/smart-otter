# Proposal: Redesign Resource Results with Carousel UI and TASA Orbiter Typography

## Why

The search results page currently presents resources as collapsible sections, which does not match the curated, editorial feel of a professional resource discovery platform. Users need a more visually engaging, horizontally scrollable presentation that makes each category feel like a hand-picked collection rather than a data table. Additionally, the application's typography should be updated to TASA Orbiter for a cohesive brand identity.

## What Changes

- Replace collapsible resource sections with four independent horizontal carousel sections (Tools, Communities, Learning Platforms, Documentation)
- Each carousel displays polished resource cards with left/right navigation controls
- Update application typography to use TASA Orbiter font across all UI elements
- Preserve existing search flow, favorites system, cache behavior, provider selection, URL parameters (`q`, `category`), loading states, error handling, and accessibility

## Capabilities

### New Capabilities

- `carousel-resource-display`: Horizontal card carousel for each resource category with independent navigation controls, responsive layout, and keyboard accessibility

### Modified Capabilities

- `search-and-discover`: Resource display presentation changes from collapsible sections to horizontal carousels; visual behavior changes but data contract (`NormalizedResponse`) remains identical

## Impact

- **Affected code**: `src/app/search/page.tsx` (primary), `src/components/ui/` (new carousel/card components), global CSS/layout for font application
- **No API changes**: `/api/search`, AI response format, cache implementation remain untouched
- **No new dependencies**: Carousel uses native CSS scroll + React refs; typography uses existing Next.js font infrastructure or `@font-face` in global styles
- **Preserved**: All existing functionality including favorites, authentication, caching, metrics, provider info, URL parameters

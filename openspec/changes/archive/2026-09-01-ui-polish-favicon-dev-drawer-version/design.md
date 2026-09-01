## Context

Smart Otter's current favicon SVG (40×40 viewBox) was designed for general branding use but lacks optimization for small icon sizes (16×16, 32×32). The dev drawer relies solely on backdrop-click or Escape to close — no explicit OK button exists. The search results page shows a redundant "Results for 'X' — provider · cached/fresh · ms" paragraph beneath the profession heading, duplicating information already visible in the heading and metrics badge.

## Goals / Non-Goals

**Goals:**
- Replace `src/app/favicon.svg` with an optimized mark using explicit hex colors (`#061826`, `#D9FBFF`) for reliable rendering at 16–32px
- Add a visible "OK" button in the dev drawer footer that closes the dialog
- Remove the redundant "Results for 'X'" paragraph from the search results page
- Bump package.json version to 0.4.1

**Non-Goals:**
- No changes to the logo component (`src/app/layout.tsx` otter icon) or any other branding asset
- No changes to AI provider logic, cache layer, database schema, or auth flow
- No new dependencies or packages

## Decisions

1. **Favicon viewBox reduced from 40×40 to 32×32 with simplified geometry.** The current SVG has fine details (mouth curves at ~1px stroke) that blur or disappear at 16px. The optimized version uses a bold outline approach: the otter face is drawn as a single filled shape with minimal internal detail, keeping eye circles ≥2px and nose ≥3px for legibility. Colors are hardcoded hex values instead of relying on CSS `currentColor` or theme variables — favicons must work in dark mode browsers without CSS support.

2. **Dev Drawer OK button placed in `DialogFooter`.** The existing dev drawer uses `<DialogContent>` with a close (X) icon rendered by the dialog component's built-in close button. Adding an OK button in `DialogFooter` provides an explicit confirmation action that also closes the dialog. This follows the existing pattern used in `DialogFooter` which already renders a Close button via `DialogPrimitive.Close`.

3. **Search results "Results for" paragraph removed entirely.** The profession heading (`<h2>`) and the metrics badge row below it already convey the searched term, provider source, cache status, and latency. Removing the intermediate `<p>` element eliminates visual redundancy without losing information.

## Risks / Trade-offs

- **[Risk]** Favicon redesign may not match user's mental model of the brand — **Mitigation**: The new mark uses the same otter face geometry as the existing SVG; only stroke weights and spacing are adjusted for small-size legibility
- **[Risk]** Removing "Results for 'X'" paragraph could confuse users who relied on it as a confirmation that their search query was processed — **Mitigation**: The profession heading in title case serves the same purpose; metrics badge below still shows provider/cache/latency

## Migration Plan

1. Replace `src/app/favicon.svg` with optimized SVG
2. Add OK button to `DevDrawer.tsx` using existing `DialogFooter` component
3. Remove lines 233–244 in `src/app/search/page.tsx` (the `<p>` element and its metrics badge)
4. Update `package.json` version field from `"0.4.0"` to `"0.4.1"`
5. Run `npm run build && npm start` to verify no regressions

No database migrations, API changes, or environment variable updates required. Rollback is a simple git revert.

## Open Questions

None. All decisions are implementation-level and do not require ADR supersession. The existing in-force ADR (ADR-0003 — Supabase PostgreSQL) is unrelated to this UI polish change.

# Proposal: UI Polish — Favicon, Dev Drawer OK Button, Search Header Cleanup, Version Bump

## Why

Smart Otter's visual polish is incomplete in three areas: the favicon still uses a 40×40 SVG not optimized for small icon sizes, the dev drawer lacks an explicit close button (relying only on backdrop click or Escape), and the search results page shows redundant "Results for 'X'" text beneath the profession heading. These are quick wins that improve perceived quality without architectural risk.

## What Changes

- **Dedicated favicon**: Replace `src/app/favicon.svg` with an optimized otter mark using explicit hex colors (`#061826`, `#D9FBFF`), designed for legibility at 16–32px. The existing logo component and other assets remain untouched.
- **Dev Drawer OK button**: Add a visible "OK" button in the dev drawer footer that closes the dialog, alongside the existing close (X) button. Uses `DialogFooter` from the shared dialog component.
- **Remove redundant search header text**: Remove the `<p>` element showing "Results for 'Profession' — provider · cached/fresh · ms" from `src/app/search/page.tsx`. The profession heading and metrics badge below it already convey this information.
- **Version bump**: Update `package.json` version from `0.4.0` to `0.4.1`.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `search-and-discover`: Removes the "Results for 'X'" subheading line; profession heading and metrics badge remain.

## Impact

- **Modified**: `src/app/favicon.svg` — complete replacement with optimized mark
- **Modified**: `src/components/dev-drawer/DevDrawer.tsx` — add OK button to footer
- **Modified**: `src/app/search/page.tsx` — remove redundant results-for paragraph
- **Modified**: `package.json` — version bump 0.4.0 → 0.4.1
- **No changes** to logo component, AI layer, cache, or database code

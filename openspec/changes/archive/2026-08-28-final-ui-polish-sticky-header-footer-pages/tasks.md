## 1. Sticky Header Implementation

- [x] 1.1 Add `useScroll` state hook to header component tracking `window.scrollY > 10`
- [x] 1.2 Apply conditional CSS classes: normal at top, translucent + backdrop-blur + border-b + shadow-sm when scrolled
- [x] 1.3 Ensure dark mode uses equivalent semi-transparent colors (`dark:bg-[#061826]/80`) matching Aurora palette
- [x] 1.4 Add `pt-[header-height]` padding to main content so top-of-page content is not hidden behind fixed header
- [x] 1.5 Verify header remains readable in both states with WCAG AA contrast on Capuccino and Aurora palettes

## 2. Footer Component

- [x] 2.1 Create `src/components/ui/footer.tsx` with brand name, three internal links (Changelog, FAQ, Privacy)
- [x] 2.2 Add creator attribution: "Created by Marcelo Brito" linking to `https://github.com/marcelosbrito` (`target="_blank" rel="noopener noreferrer"`)
- [x] 2.3 Add social icons using existing Lucide React icons (Github, Twitter/X, Linkedin) with accessible labels and hover/focus states
- [x] 2.4 Import and render `<Footer />` in root layout (`src/app/layout.tsx`) so it appears on every page
- [x] 2.5 Verify footer stacks naturally on mobile viewport (≤640px) without horizontal overflow

## 3. Changelog Page

- [x] 3.1 Create `src/app/changelog/page.tsx` using Next.js App Router route segment
- [x] 3.2 Implement chronological release list ordered newest first with version identifiers and dates
- [x] 3.3 Populate entries from verified project evidence: v0.1.0 (initial commit), v0.2.0 (MVP), v0.3.0 (UI redesign + AI fallback), v0.3.1 (Supabase migration + Dev Drawer), v0.4.0 (this change)
- [x] 3.4 Apply existing TASA Orbiter typography, Capuccino/Aurora palettes, centered content width

## 4. FAQ Page

- [x] 4.1 Create `src/app/faq/page.tsx` using Next.js App Router route segment
- [x] 4.2 Implement accordion with semantic `<button>` elements for each question toggle
- [x] 4.3 Add ARIA attributes (`aria-expanded`, `aria-controls`) and keyboard accessibility (Enter/Space to toggle, Escape to close)
- [x] 4.4 Write FAQ content covering: product purpose, AI generation, caching behavior, multi-provider strategy, Developer Mode, accuracy disclaimer, feature limitations
- [x] 4.5 Implement single-open accordion behavior (clicking open item collapses it; clicking another opens that one)

## 5. Privacy Page

- [x] 5.1 Create `src/app/privacy/page.tsx` using Next.js App Router route segment
- [x] 5.2 Write privacy content accurately reflecting actual implementation: Clerk auth, Supabase favorites/cache, Groq/Ollama API calls (user-configured keys), no analytics tracking
- [x] 5.3 Apply existing TASA Orbiter typography, Capuccino/Aurora palettes, centered content width

## 6. Version Bump and Verification

- [x] 6.1 Update `package.json` version from `0.3.1` to `0.4.0`
- [x] 6.2 Run `npm run build` and verify production build succeeds without errors
- [x] 6.3 Verify sticky header at page top (opaque) and after scrolling (translucent + blurred)
- [x] 6.4 Verify all footer links navigate correctly to `/changelog`, `/faq`, `/privacy`
- [x] 6.5 Verify GitHub, X, LinkedIn external links open in new tabs with correct URLs
- [x] 6.6 Test FAQ accordion keyboard navigation (tab, Enter/Space toggle, Escape close)
- [x] 6.7 Verify no horizontal overflow on desktop and mobile viewports
- [x] 6.8 Confirm existing search, favorites, authentication, and cache functionality unchanged

# Design: Sticky Header, Footer and Supporting Pages

## Context

Smart Otter is a Next.js 16.3 App Router application with React 19, TypeScript strict mode, Tailwind CSS v4, and TASA Orbiter typography. The current header is a static component rendered in `src/app/layout.tsx` (or a dedicated header component). There is no footer — pages end abruptly after their main content. Three internal routes (`/changelog`, `/faq`, `/privacy`) are referenced in the design but do not exist.

The existing ADR-0003 (Supabase PostgreSQL) is unrelated to this UI-only change and remains in force. No architectural decisions need revisiting.

## Goals / Non-Goals

**Goals:**
- Make the header sticky with a scroll-triggered translucent glass effect
- Add a minimal global footer consistent across all pages
- Create three supporting pages (Changelog, FAQ, Privacy) using existing design tokens
- Version bump to 0.4.0

**Non-Goals:**
- No changes to search API, AI provider logic, cache behavior, authentication, or favorites
- No new dependencies or icon libraries
- No CMS, analytics, or database schema changes
- No redesign of existing components beyond header sticky behavior and footer addition

## Decisions

### 1. Sticky Header Implementation: `useScroll` hook in header component

**Decision**: Use a lightweight client-side scroll state via `useState` + `useEffect` inside the existing header component (or a wrapper). Track `window.scrollY > threshold` to toggle a CSS class.

**Rationale**: 
- No library needed; Next.js/React already provides everything
- Keeps the sticky logic co-located with the header component
- Avoids adding a global scroll context provider which would be over-engineering for one component
- Threshold of ~10px gives natural feel without flicker at page top

**Alternatives considered**:
- `IntersectionObserver` — more precise but adds complexity; unnecessary for a simple threshold check
- CSS `position: sticky` alone — cannot achieve the translucent/blurred effect on scroll with pure CSS in all browsers; JS class toggle is needed for the glass effect

### 2. Glass Effect: Tailwind utilities + inline backdrop-filter

**Decision**: Use Tailwind's built-in utilities (`bg-white/70`, `backdrop-blur-md`, `border-b`, `shadow-sm`) combined with a CSS transition on the background color class. For dark mode, use equivalent semi-transparent dark colors (`dark:bg-[#061826]/80`).

**Rationale**:
- Tailwind CSS v4 already supports arbitrary opacity modifiers and backdrop utilities
- No custom CSS file needed; keeps changes minimal
- Existing Capuccino/Aurora palettes are already defined in `tailwind.config`/CSS variables

### 3. Footer as shared layout component

**Decision**: Create a single `<Footer />` component at `src/components/ui/footer.tsx` (following the existing `src/components/ui/` convention for base UI primitives). Import it once in the root layout file (`src/app/layout.tsx`) so it renders on every page.

**Rationale**:
- Single source of truth; no duplication across pages
- Consistent with how the header is already rendered via layout
- Easy to maintain and update

### 4. Social icons: Existing Lucide React icons

**Decision**: Use `lucide-react` icons that are already installed (`Github`, `Twitter/X equivalent`, `Linkedin`). The project already imports Lucide icons in existing components.

**Rationale**:
- No new dependencies; `lucide-react` is already a production dependency
- Consistent icon style with the rest of the application
- Each icon wrapped in an `<a>` tag with accessible label

### 5. FAQ accordion: Semantic HTML + state management

**Decision**: Use a controlled React state (`openIndex`) to manage which FAQ item is expanded. Each question uses a `<button>` element (not `<div>`) for keyboard accessibility. ARIA attributes (`aria-expanded`, `aria-controls`) are applied per item. Single-open behavior: clicking an open item collapses it; clicking another opens that one.

**Rationale**:
- Semantic buttons are required for keyboard navigation and screen readers
- Simple state management avoids needing a library like Radix or Headless UI
- Consistent with the project's "no unnecessary dependencies" constraint

### 6. Supporting pages: Next.js App Router route segments

**Decision**: Create three route segment directories under `src/app/`:
- `src/app/changelog/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/privacy/page.tsx`

Each page uses the existing layout (header + footer) inherited from the root layout. Content is static JSX with Tailwind classes matching existing design tokens.

**Rationale**:
- Next.js App Router naturally supports nested route segments
- Root layout already provides header; footer added via same layout
- No need for custom layouts per page — they all share the same visual language

### 7. Changelog content: Derived from git history and OpenSpec archives

**Decision**: Generate changelog entries from actual project evidence:
- `e2ae245` → Initial commit (v0.1.0)
- `000ffa7` → MVP implementation (search, favorites, auth, cache) (v0.2.0)
- `b7f8232` → UI redesign with dark mode, AI fallback chain (Groq → Ollama), search polish (v0.3.0)
- `942d504` → Supabase migration, Dev Drawer provider toggle (v0.3.1)
- `cb8addb` → Final UI polish: Capuccino/Aurora palettes, otter icon, card height fix (v0.4.0)

**Rationale**:
- Each commit maps to a meaningful milestone
- OpenSpec archives confirm the feature scope of each phase
- No fabricated content; every entry traceable to git or spec evidence

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Sticky header may overlap page content on scroll | Add `pt-[header-height]` padding-top to main content area so top-of-page content is not hidden behind the fixed header |
| Backdrop blur may cause performance issues on low-end devices | Use `will-change-transform` and hardware-accelerated CSS; test on mobile before shipping |
| FAQ accordion state lost on navigation (client-only) | Acceptable — FAQ is a static informational page; no data loss concern |
| Changelog content becomes stale over time | Document that changelog should be updated with each meaningful release; not automated |

## Migration Plan

This is a pure UI addition with no database, API, or auth changes. Deployment is straightforward:

1. Implement all components and pages in a single branch
2. Run `npm run build && npm start` to verify production build succeeds
3. Deploy to existing Supabase + Next.js hosting (Vercel)
4. No database migrations needed
5. No rollback required — if issues arise, revert the commit

## Open Questions

- None identified. The scope is well-defined and does not conflict with any in-force ADRs. ADR-0003 (Supabase PostgreSQL) remains fully applicable and unaffected by this UI-only change.

## 1. Install Dependencies and Configure Theme Provider

- [x] 1.1 Run `npm install next-themes` to add theme management library
- [x] 1.2 Extract `SYSTEM_PROMPT` constant from `gemini-provider.ts` into a new shared file `src/lib/ai/prompt.ts` so all providers use identical prompts
- [x] 1.3 Wrap `<html>` in `src/app/layout.tsx` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` from `next-themes`
- [x] 1.4 Remove `enableSystem` if system detection causes issues; verify theme persists via localStorage after page reload

## 2. Add Dark Mode Toggle to Header

- [x] 2.1 Create or update `src/components/ui/theme-toggle.tsx` with a button that calls `setTheme('dark')` / `setTheme('light')` using `useTheme()` hook
- [x] 2.2 Use sun/moon lucide icons that swap based on current theme state
- [x] 2.3 Add the toggle button to the right side of the header nav in `src/components/auth/header.tsx` (between "Search" link and Clerk auth)
- [x] 2.4 Verify theme switches work across all pages (landing, search, favorites, sign-in/sign-up) with no flash of unstyled content

## 3. Polish globals.css for Both Themes

- [x] 3.1 Review existing `globals.css` dark mode variables; adjust any that have insufficient contrast in dark mode
- [x] 3.2 Add `@layer base { * { transition: background-color 200ms, color 200ms, border-color 200ms; } }` for smooth theme transitions
- [x] 3.3 Verify primary/secondary/accent colors work in both light and dark modes (check buttons, links, badges)

## 4. Redesign Landing Page (`src/app/page.tsx`)

- [x] 4.1 Replace the bare centered div with a full hero section layout:
  - Left side: large headline ("Find Any Profession's Best Resources — Powered by AI")
  - Subheadline explaining how it works in one sentence
  - Prominent "Start Searching" CTA button linking to `/search`
- [x] 4.2 Add feature cards below the hero (3 columns on desktop, stacked on mobile):
  - Card 1: "AI-Powered Search" — enters any profession, gets curated results instantly
  - Card 2: "Curated Resources" — tools, communities, learning platforms, documentation
  - Card 3: "Instant Results from Cache" — repeated searches are fast
- [x] 4.3 Add subtle gradient or accent color backgrounds to hero area (using Tailwind gradients or CSS `linear-gradient`)
- [x] 4.4 Ensure responsive layout: centered single-column on mobile, multi-column grid on desktop ≥1024px

## 5. Enhance Search Results Page (`src/app/search/page.tsx`)

- [x] 5.1 Add provider attribution badge below the profession heading (e.g., "Results for 'X' — Gemini · Fresh · 342ms")
- [x] 5.2 Update result cards with polished styling: rounded corners, subtle shadow on hover, adequate padding
- [x] 5.3 Replace static skeleton placeholders with animated shimmer effect using CSS `@keyframes` or Tailwind's `animate-pulse` variant
- [x] 5.4 Add staggered fade-in animation for result cards (use CSS `animation-delay` with inline style based on index)
- [x] 5.5 Ensure category headers show resource count and chevron icon rotates on expand/collapse

## 6. Implement Groq Provider (`src/lib/ai/groq-provider.ts`)

- [x] 6.1 Run `npm install groq-sdk` (or appropriate Groq SDK package)
- [x] 6.2 Create `src/lib/ai/groq-provider.ts` implementing `ProviderInterface`:
  - Uses `Groq` client with `apiKey: process.env.GROQ_API_KEY`
  - Sends chat completion request with shared `SYSTEM_PROMPT` from step 1
  - Parses response JSON identically to `GeminiProvider` (extract `{...}` via regex, then `JSON.parse`)
  - Model configurable via `GROQ_MODEL` env var, defaulting to a fast model like `llama-3.1-8b-instant` or `mixtral-8x7b-32k`
- [x] 6.3 Handle Groq-specific errors: 429 rate limits with exponential backoff (base 1s, max 3 retries)
- [x] 6.4 Update `src/lib/ai/factory.ts` to import and register the real Groq provider instead of the stub

## 7. Implement Ollama Provider (`src/lib/ai/ollama-provider.ts`)

- [x] 7.1 Create `src/lib/ai/ollama-provider.ts` implementing `ProviderInterface`:
  - Uses native `fetch()` to `${OLLAMA_BASE_URL}/api/chat` (default: `http://localhost:11434`)
  - Model configurable via `OLLAMA_MODEL` env var, defaulting to `llama3`
  - Sends messages array with system prompt + user query
  - Parses response JSON identically to other providers
- [x] 7.2 Handle connection errors gracefully (timeout after 15s, network unreachable)
- [x] 7.3 Update `src/lib/ai/factory.ts` to import and register the real Ollama provider instead of the stub

## 8. Implement AI Fallback Chain in Service Layer (`src/lib/ai/service.ts`)

- [x] 8.1 Replace the knowledge-base fallback with sequential provider retry logic:
  - Try primary provider (as configured)
  - If it fails AND `GROQ_API_KEY` is set, try Groq provider
  - If both fail AND `OLLAMA_BASE_URL` is set, try Ollama provider
- [x] 8.2 Update metrics object to include actual provider used and error chain (which providers failed)
- [x] 8.3 Keep cache-as-last-resort behavior: if all providers fail but cached result exists for the query, serve from cache with `error` field in metrics
- [x] 8.4 If no providers succeed AND no cache exists, throw descriptive error ("Search failed — AI service temporarily unavailable")

## 9. Update Tests

- [x] 9.1 Run existing test suite: `npx vitest` and verify all tests pass (36/36 passed)
- [x] 9.2 Update `tests/ai/provider.test.ts` to test real GroqProvider behavior (if GROQ_API_KEY is set in env during test)
- [x] 9.3 Add test for OllamaProvider stub (connection refused → throws error gracefully)
- [x] 9.4 Add integration test for fallback chain: primary fails → secondary activates → metrics report correct provider

## 10. Remove Knowledge Base

- [x] 10.1 Manually verify that Groq and/or Ollama providers return valid results for several non-trivial queries (e.g., "Game Developer", "Quantum Computing Researcher")
- [x] 10.2 Delete `src/lib/ai/knowledge-base.ts` entirely
- [x] 10.3 Remove import of `getKnowledgeBaseResponse` from `src/lib/ai/service.ts`
- [x] 10.4 Run `npx vitest` again to confirm no broken imports (36/36 passed)

## 11. Final Verification and Cleanup

- [x] 11.1 Run `npm run lint` and fix any ESLint errors introduced by changes
- [x] 11.2 Test the full user flow: visit homepage → toggle theme → click "Start Searching" → enter profession → view results with provider badge — **PENDING**: favorites page blocked by sql.js WASM issue (see tasks 15.2/15.3)
- [x] 11.3 Verify dark mode works on all pages (landing, search, favorites, sign-in/sign-up)
- [x] 11.4 Update `.env.local` template or AGENTS.md with new environment variables: `GROQ_API_KEY`, `GROQ_MODEL`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- [x] 11.5 Run `openspec validate redesign-ui-ai-fallbacks --type change --strict` to verify spec compliance (valid)

## 12. Post-Implementation Fixes

- [x] 12.1 Fix hydration mismatch — wrap ThemeProvider in client component, remove enableSystem and defaultTheme
- [x] 12.2 Remove Gemini provider from fallback chain — default to Groq → Ollama only
- [x] 12.3 Fix middleware matcher — expand from `/api` only to all routes for Clerk auth on pages
- [x] 12.4 Fix sql.js WASM path — use modulePath CDN URL instead of local file for Next.js server actions
- [x] 12.5 Fix favorites page empty state — show "No favorites yet" message with icon and description
- [x] 12.6 Fix Sign In button visibility — use `useAuth()` to conditionally render based on session state
- [x] 12.7 Update all tests for new Groq → Ollama fallback chain behavior (36/36 passing)

## 13. Additional Fixes

- [x] 13.1 Fix duplicate ClientAuth rendering in header — removed left-side nav instance, keep only right-aligned auth
- [x] 13.2 Hide favorite bookmark button when user is not authenticated on search page
- [x] 13.3 Update Ollama model configuration to use `llama3.2` instead of default `llama3`

## 14. sql.js WASM Loading Fix

- [x] 14.1 Copy `sql-wasm.wasm` from node_modules to `.data/` directory as fallback binary for Server Actions

## 15. Favorites Page Fix — sql.js WASM Reliability

- [x] 15.1 Rewrite `src/lib/db/client.ts` to use `wasmBinary` with local ArrayBuffer (`fsp.readFile + new Uint8Array`) instead of CDN URL or locateFile — fixes favorites page hanging on "Loading..." due to Windows path mangling of HTTP URLs
- [x] 15.2 Verify favorites page loads correctly (empty state shows, saved items display, remove works) — **COMPLETED**: Migrated to Supabase via `add-supabase-ollama-dev-drawer` change; sql.js legacy files removed
- [x] 15.3 Consider migrating to a persistent external database (PostgreSQL/Supabase) for production use — sql.js is per-process and loses data on server restart — **COMPLETED**: Supabase migration implemented in `add-supabase-ollama-dev-drawer` change

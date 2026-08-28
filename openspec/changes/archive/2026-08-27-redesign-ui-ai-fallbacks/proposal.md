## Why

The Smart Otter frontend has a generic, unpolished UI that doesn't reflect its AI-powered value proposition. The hero copy is bland ("Discover curated resources..."), the search page lacks visual hierarchy and modern design patterns, and dark mode CSS variables exist but there is no toggle mechanism. Additionally, when Google Gemini returns "service busy" errors (common with free tier), users get a hardcoded knowledge-base fallback that only covers 4 professions — leaving most queries without results. The Groq and Ollama providers are stubs returning empty responses, so the entire AI fallback chain is broken for real-world use.

## What Changes

- **Redesign landing page** with compelling hero copy, visual hierarchy, feature highlights, and modern layout patterns
- **Add dark mode toggle** that persists preference to localStorage; use `next-themes` or manual class-based approach on `<html>` element
- **Improve search results page** with better card design, animated states, provider badges showing fallback chain status (e.g., "Gemini → Groq"), and polished skeleton loaders
- **Implement real GroqProvider** using `@groq/generative-ai` SDK as secondary AI provider when Gemini fails; falls back to Ollama for local inference if GROQ_API_KEY is set
- **Add OpenRouter as orchestration layer** (evaluate in ADR) — single API key, automatic model fallback, usage analytics across providers. If adopted: replace direct Groq/Ollama calls with OpenRouter SDK
- **Remove hardcoded knowledge-base fallback** (`src/lib/ai/knowledge-base.ts`) after verifying that secondary/local AI providers work reliably for any profession query
- **Update root layout** to support theme toggle via `next-themes` Provider wrapping the app

## Capabilities

### New Capabilities
- `dark-mode-toggle`: Theme switching with system preference detection, localStorage persistence, and smooth transitions across all pages
- `ai-fallback-chain`: Multi-provider AI search with automatic fallback: Gemini → Groq → Ollama (local), with graceful degradation and provider badges in UI
- `modern-landing-page`: Redesigned hero section with compelling copy, feature cards, gradient accents, and responsive layout
- `enhanced-search-results`: Improved result cards with animated transitions, category grouping, provider attribution badges, and polished empty/loading states

### Modified Capabilities
- `search-and-discover`: AI search now uses fallback chain instead of hardcoded knowledge-base; metrics report actual provider used (not just "knowledge-base")
- `resource-categorization`: Categories remain the same but UI presentation changes — cards with better visual hierarchy, inline explanations, and action buttons

## Impact

**Files affected:**
- `src/app/page.tsx` — complete redesign
- `src/components/auth/header.tsx` — add theme toggle button
- `src/app/layout.tsx` — wrap in ThemeProvider
- `src/app/globals.css` — polish dark/light color palette, add transitions
- `src/lib/ai/stubs.ts` — implement real Groq and Ollama providers
- `src/lib/ai/service.ts` — replace knowledge-base fallback with provider chain fallback; update metrics reporting
- `src/lib/ai/knowledge-base.ts` — remove (after verifying fallback works)
- `src/app/search/page.tsx` — redesign results page, add provider badges
- `package.json` — add `@groq/generative-ai`, optionally `openrouter-ai` or `@openrouter/ai`

**Dependencies:**
- New: `next-themes` (dark mode), `@groq/generative-ai` (Groq fallback)
- Optional: `openrouter-ai` (if ADR decision adopts OpenRouter orchestration)
- Env vars needed: `GROQ_API_KEY`, optionally `OPENROUTER_API_KEY`, `OLLAMA_BASE_URL`

**Breaking:**
- Knowledge base is removed — no more hardcoded responses for "frontend developer", "backend developer", etc. All queries now require AI inference or cache hit.

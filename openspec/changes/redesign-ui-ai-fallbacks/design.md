## Context

Smart Otter is a Next.js App Router application (React 19, TypeScript) with Clerk auth, in-memory SQLite via sql.js, and an AI-powered resource discovery pipeline. The current UI is a bare-bones landing page (`flex flex-1 flex-col` centered div), a functional but plain search results page with basic cards, and no theme toggle despite dark-mode CSS variables already being defined.

The AI provider chain has one stub provider (Gemini via `@google/generative-ai` that was unreliable due to rate limits) and two working providers: Groq (primary, cloud-based) and Ollama (local fallback). When the primary fails with errors, the system falls back to a hardcoded knowledge base covering only 4 professions — leaving most queries without results entirely.

The existing ADRs establish: (1) `ProviderInterface` abstraction via factory pattern (ADR-0001), and (2) SQLite persistence for favorites (ADR-0002). This change does not alter either decision.

## Goals / Non-Goals

**Goals:**
- Redesign landing page with compelling copy, feature cards, gradient accents, and responsive layout
- Add dark mode toggle with system preference detection, localStorage persistence, and smooth transitions
- Implement real Groq provider as primary AI provider using `@groq/generative-ai` SDK
- Implement Ollama provider for local inference when cloud providers are unavailable
- Remove hardcoded knowledge-base fallback after verifying the AI chain works for arbitrary queries
- Polish search results page with animated cards, provider badges, and skeleton loaders

**Non-Goals:**
- Migrating away from sql.js or changing the database layer (ADR-0002 stays)
- Adding new API routes beyond existing ones (`/api/search`, `/api/favorites/save`)
- Implementing OpenRouter orchestration in this change — evaluate it in ADR, implement only if decided
- Redesigning the favorites page or auth flows

## Decisions

### Decision 1: Dark Mode via `next-themes` Provider

**Choice:** Use `next-themes` (v0.4+) with manual theme toggle stored in `localStorage`.

**Rationale:** 
- `next-themes` handles SSR-safe theme initialization, preventing flash of unstyled content
- It wraps the app in a `<ThemeProvider>` and exposes `useTheme()` hook for toggle logic
- System preference detection is built-in (`forceUseEffect: true`)
- Alternatives considered: manual class-based approach on `<html>` element (more code, no SSR safety), Tailwind CSS `darkMode: 'class'` only (requires custom JS for toggle)

**Implementation:**
```tsx
// src/app/layout.tsx — wrap with ThemeProvider
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* existing content */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The header gets a `<ThemeToggle>` button that calls `setTheme('dark')` / `setTheme('light')`. The `disableTransitionOnChange={false}` ensures smooth transitions.

### Decision 2: AI Fallback Chain in Service Layer (Not Frontend)

**Choice:** Implement the fallback chain inside `searchService()` in `src/lib/ai/service.ts`, not in individual providers or the API route.

**Rationale:**
- The service layer already handles cache validation and response normalization — it's the natural place for provider orchestration
- Keeps each provider implementation focused on its own SDK/API concerns (ADR-0001 contract)
- The frontend only sees `{ response, metrics }` — no knowledge of which providers were tried

**Implementation:**
```ts
// In searchService(), replace knowledge-base fallback with:
try {
  const rawResponse = await groqProvider.search(query); // primary (groq)
  return normalizeAndCache(rawResponse, 'Groq');
} catch (err) {
  // Try Ollama if available
  if (process.env.OLLAMA_BASE_URL) {
    try {
      const rawResponse = await ollamaProvider.search(query);
      return normalizeAndCache(rawResponse, 'Ollama', err.message); // err for metrics
    } catch (ollamaErr) {
      // All providers failed — check cache or throw
      const cached = cache.get(query);
      if (cached) return { response: cached, metrics: { ...cacheMetrics, error: 'All AI providers unavailable' } };
      throw new Error(`Search failed after trying all providers`);
    }
  }
}
```

The `metrics` object includes the actual provider used and an optional `error` field describing what failed.

### Decision 3: Groq Provider Uses Official SDK with Shared System Prompt

**Choice:** Implement Groq using `@groq/generative-ai` (or direct HTTP calls to Groq API) with a shared system prompt across all providers.

**Rationale:**
- Consistent output format across providers ensures normalization works without provider-specific logic
- Groq's API is compatible with Google's Generative AI SDK pattern (generateContent endpoint)
- The existing `SYSTEM_PROMPT` in `gemini-provider.ts` can be extracted to a shared constant

**Implementation:**
```ts
// src/lib/ai/stubs.ts → src/lib/ai/groq-provider.ts
import { Groq } from 'groq-sdk'; // or @groq/generative-ai if available
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class GroqProvider implements ProviderInterface {
  readonly name = 'Groq';
  
  async search(query: string): Promise<RawResponse> {
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'; // or mixtral, etc.
    const response = await groq.chat.completions.create({
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: query }],
      model,
      temperature: 0.1,
    });
    const text = response.choices[0]?.message?.content || '';
    // Parse JSON same as GeminiProvider does
    return parseJsonResponse(text);
  }
}
```

### Decision 4: Ollama Provider Uses REST API Directly

**Choice:** Connect to Ollama via its native HTTP API (`/api/chat` or `/generate`) rather than an SDK.

**Rationale:**
- Ollama's Node.js SDK is minimal and wraps the same REST API
- Direct fetch avoids dependency overhead and works with any Ollama-compatible endpoint
- Default `OLLAMA_BASE_URL=http://localhost:11434` for local development; configurable for remote instances

**Implementation:**
```ts
// src/lib/ai/ollama-provider.ts
export class OllamaProvider implements ProviderInterface {
  readonly name = 'Ollama';
  
  async search(query: string): Promise<RawResponse> {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3';
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        stream: false,
      }),
    });
    const data = await res.json();
    return parseJsonResponse(data.message?.content || '');
  }
}
```

### Decision 5: OpenRouter Evaluation (ADR Only — Not Implemented Here)

**Choice:** Evaluate OpenRouter in the ADR artifact. Do NOT implement it unless the ADR decision is "adopt."

**Rationale for evaluation:**
- OpenRouter provides a single API key across multiple providers (Gemini, Groq, Claude, etc.) with automatic model fallback
- Could simplify the provider chain to one SDK call: `openrouter.chat.completions.create()` with model list and fallback config
- Adds dependency cost (`openrouter-ai` or equivalent) and external service coupling
- Loses per-provider observability (harder to know which specific model was used)

**Alternatives considered:**
- **Keep current chain (Groq → Ollama):** Full control, no extra vendor, but manual fallback logic
- **Adopt OpenRouter:** Single integration, automatic fallback across many models, usage analytics — at cost of vendor lock-in and reduced transparency

### Decision 6: Knowledge Base Removal After Verification

**Choice:** Delete `knowledge-base.ts` only after verifying that Groq/Ollama providers return valid results for arbitrary profession queries.

**Rationale:**
- The knowledge base covers exactly 4 professions with hardcoded data — it's a crutch, not a feature
- Once real fallback providers are functional, the KB provides no value and creates inconsistency (KB answers feel different from live AI answers)
- Cache still serves as the real safety net: if all providers fail but a cached result exists for that query, it will be served

**Migration path:** 
1. Implement Groq + Ollama providers
2. Run `npx vitest` to verify provider tests pass
3. Manually test search queries for professions NOT in the KB (e.g., "Game Developer", "Quantum Computing Researcher")
4. Only then delete `knowledge-base.ts` and its import from `service.ts`

## Risks / Trade-offs

[Risk: Groq API key cost] → Mitigation: Groq free tier is generous; set a budget alert in the developer's Groq dashboard. The provider can be disabled by omitting `GROQ_API_KEY`.

[Risk: Ollama requires local model download] → Mitigation: Default to `llama3` (~5GB). Document setup in AGENTS.md. The provider is only used as last resort when cloud providers fail.

[Risk: `next-themes` adds bundle size] → Mitigation: ~2KB gzipped, negligible for this app. Only loaded on the server side (RSC-friendly).

[Risk: Removing knowledge base may break existing cached queries] → Mitigation: Cache is independent of KB; only new uncached queries are affected. If a user's query was previously answered by KB but not cached, they'll get an error until AI providers improve — this is acceptable since the KB answers were stale anyway.

[Risk: Sequential fallback increases latency on failure] → Mitigation: Each provider timeout should be bounded (e.g., 15s). Worst case: ~30s if both fail, but this is rare and the UI shows a loading state with elapsed time.

## Migration Plan

1. **Phase 1 — Dependencies & Theme:** Add `next-themes` to package.json. Wrap layout in ThemeProvider. Add theme toggle button to header.
2. **Phase 2 — Landing Page Redesign:** Rewrite `src/app/page.tsx` with hero section, feature cards, and gradient accents. Update header nav if needed.
3. **Phase 3 — Search Results Polish:** Enhance search page with animated cards, provider badges, skeleton loaders. No behavior changes yet.
4. **Phase 4 — AI Fallback Chain:** Extract `SYSTEM_PROMPT` to shared constant. Implement real GroqProvider and OllamaProvider. Update `service.ts` fallback chain. Run tests.
5. **Phase 5 — Knowledge Base Removal:** After verifying Phase 4 works for arbitrary queries, delete `knowledge-base.ts` and its import from `service.ts`.

**Rollback:** Each phase is independently reversible. If AI fallback causes issues, revert to the Gemini-only + knowledge-base path by restoring `knowledge-base.ts`. Theme changes are isolated and can be reverted without affecting functionality.

## Open Questions

1. **OpenRouter adoption:** Should we adopt OpenRouter in this change or defer? The ADR step will evaluate tradeoffs. If adopted, it replaces decisions 2–4 with a single OpenRouter SDK integration.
2. **Provider timeout configuration:** What should the per-provider timeout be? Defaulting to 15s per provider seems reasonable but hasn't been tested against actual Groq/Ollama response times.
3. **In-force ADRs:** ADR-0001 (AI Provider Interface) remains in force and is not superseded by this change — the fallback chain operates within its contract. No action needed on ADR-0002 (SQLite).

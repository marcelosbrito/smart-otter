# AGENTS.md

## Workflow
- For OpenSpec propose/apply/verify/archive workflows, use the `openspec-git-discipline` skill to enforce proposal commits before apply and merge-before-archive discipline.
- Main specs: `openspec/specs/`; active changes: `openspec/changes/`; archived: `openspec/changes/archive/`. ADRs: `openspec/adr/`.

## Commands
- `npm run dev` — Next.js dev server (port 3000)
- `npm run build && npm start` — production build + serve; must build first, `start` alone won't compile
- `npx eslint . --ext .ts,.tsx` — lint check
- `npx vitest` — run all tests (globals: true, environment: node)
- `npx vitest <file>` — run a single test file

No typecheck script exists (`tsc --noEmit`). Only ESLint for static analysis.

## Tests
- `tests/auth/clerk-auth.test.ts` — Clerk auth integration
- `tests/ai/provider.test.ts` — AI provider tests (requires running Ollama to pass)
- `tests/ai/service-integration.test.ts` — search service integration
- `tests/ai/knowledge-cache.test.ts` — cache operations
- `tests/db/server-actions.test.ts` — database layer / server actions
- No fixture setup; Node environment, not browser. Supabase stub activates when credentials are missing — all DB calls resolve to null/error.

## Architecture at a glance
- **Framework**: Next.js 16.3 App Router, React 19, TypeScript strict mode, `@/*` → `./src/*`. Tailwind CSS v4 via `@tailwindcss/postcss`. Dev server generates types into `.next/dev/types/**/*.ts`.
- **Auth**: Clerk via middleware (`src/middleware.ts`). All API routes and pages require a valid Clerk session. Keys in `.env.local`.
- **Database**: Supabase PostgreSQL. Schema in `src/lib/db/types.ts` (Database interface with TypeScript Row/Insert/Update). Tables: `users`, `favorites`, `knowledge_cache`. RLS enabled, service-role policies for API routes.
  - Server-side: `createSupabaseServerClient()` from `supabase-server.ts` — uses `SUPABASE_SERVICE_ROLE_KEY`. Exports a stub when credentials are missing.
  - Browser-side: exported `supabase` from `supabase-client.ts` — uses `@supabase/ssr`'s `createBrowserClient`, falls back to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` if `SUPABASE_ANON_KEY` is unset.
- **Cache**: `src/lib/cache/knowledge-cache.ts` — async functions (`getCache`, `setCache`, `clearCache`, `getCacheStats`) backed by the `knowledge_cache` table with 24h TTL. Cache key = lowercase query with spaces replaced by hyphens.
- **AI layer** (`src/lib/ai/`): ProviderInterface + factory (`createProvider`). Fallback chain: Groq → Ollama (local). Shared prompt in `prompt.ts`. Providers use lazy env var validation — instantiation succeeds, `search()` throws if keys are missing. Service uses async cache functions and normalizes raw responses into categories (Tools, Communities, LearningPlatforms, Documentation).
- **UI components**: From `@base-ui/react`, not shadcn CLI scaffolding. Add UI components to `src/components/ui/`. Tailwind CSS v4 with `tw-animate-css`.
- **API routes**: `/api/search` — search endpoint; `/api/favorites/save` + `/api/favorites/check` — favorites CRUD; `/api/auth/status` — Clerk session check; `/api/dev/cache-stats` + `/api/dev/clear-cache` — dev mode cache management.

## Environment Variables
Required (from `.env.local.example`):
- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in/sign-up URL overrides
- **AI providers**: `GROQ_API_KEY` (primary), `GROQ_MODEL` defaults to `openai/gpt-oss-120b`; `OLLAMA_BASE_URL` defaults to `http://localhost:11434`, `OLLAMA_MODEL=llama3.2`. For remote Ollama via Cloudflare Tunnel, set `OLLAMA_BASE_URL` to the HTTPS tunnel URL.
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Browser client also uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as fallback for anon key.

## Gotchas
- `.env*` files are gitignored; tests and API routes that depend on AI providers need env keys set at runtime or they return empty stubs.
- The Supabase server client caches its instance (`cachedClient`) — it's a singleton per process, not re-created per request.
- Cache operations (`getCache`, `setCache`) are async and depend on the Supabase-backed `knowledge_cache` table. Without credentials, they silently resolve to null/error via the stub.
- Provider selection persists in `localStorage` under key `smart-otter-active-provider`. The search service respects this client-side setting when running in browser context.

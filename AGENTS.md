# AGENTS.md

## Workflow
- For OpenSpec propose/apply/verify/archive workflows, use the `openspec-git-discipline` skill to enforce proposal commits before apply and merge-before-archive discipline.
- Main specs live in `openspec/specs/`; active changes in `openspec/changes/`; archived changes in `openspec/changes/archive/`. ADRs are in `openspec/adr/`.

## Commands
- `npm run dev` — Next.js dev server (port 3000)
- `npm run build && npm start` — production build + serve; must build first, `start` alone won't compile
- `npm run lint` — ESLint only; no typecheck or formatter script in package.json
- `npx vitest` — run all tests (globals: true, environment: node)
- `npx vitest <file>` — run a single test file

## Tests
- Test files live under `tests/`: auth (`tests/auth/`), AI/service (`tests/ai/`), DB (`tests/db/`)
- No fixture setup required; tests run in Node environment, not browser
- Supabase stub is active when credentials are missing — all DB calls resolve to null/error. Tests that assert real DB behavior need credentials set.

## Architecture at a glance
- **Framework**: Next.js App Router (`src/app/`) with React 19, TypeScript strict mode, `@/*` → `./src/*` alias. Dev server generates types into `.next/dev/types/**/*.ts`.
- **Auth**: Clerk via middleware (`src/middleware.ts`). All API routes and server actions require a valid Clerk session. Keys in `.env.local`.
- **Database**: Supabase (PostgreSQL) — no local DB file. Schema defined in `src/lib/db/types.ts` with TypeScript types. Tables: `users`, `favorites`, `knowledge_cache`. Uses `@supabase/ssr` for SSR support. Client exports a stub when credentials are missing.
- **Cache**: Knowledge cache at `src/lib/cache/knowledge-cache.ts` — async functions (`getCache`, `setCache`, `clearCache`) backed by the `knowledge_cache` Supabase table.
- **AI layer** (`src/lib/ai/`): ProviderInterface + factory (`createProvider`). Fallback chain: Groq → Ollama (local). Shared prompt in `prompt.ts`. Providers use lazy env var validation — instantiation succeeds, `search()` throws if keys are missing. Service uses async cache functions.
- **UI components**: Components from `@base-ui/react`, not shadcn CLI scaffolding. Add UI components by copying into `src/components/ui/`.
- **API routes**: `/api/search`, `/api/favorites/save`, `/api/auth/status`, `/api/dev/cache-stats`, `/api/dev/clear-cache`

## Environment Variables
Required for AI providers:
- `GROQ_API_KEY` — Groq provider (primary)
- `GROQ_MODEL` — defaults to `llama-3.1-8b-instant`
- `OLLAMA_BASE_URL` — defaults to `http://localhost:11434`
- `OLLAMA_MODEL` — defaults to `llama3`

Required for database/cache:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (for server-side DB access)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Publishable key for browser client

## Gotchas
- `.env*` files are gitignored; tests and API routes that depend on AI providers need env keys set at runtime or they return empty stubs.
- There is no typecheck script (`tsc --noEmit`). Only `npm run lint` exists for static analysis.
- The Supabase client uses `@supabase/ssr` — server-side code uses `createSupabaseServerClient()` from `supabase-server.ts`, browser code uses the exported `supabase` from `supabase-client.ts`.
- All cache operations (`getCache`, `setCache`) are async and depend on the Supabase-backed knowledge_cache table.

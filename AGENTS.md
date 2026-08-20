# AGENTS.md

## Workflow
- For OpenSpec propose/apply/verify/archive workflows, use the local `openspec-git-discipline` skill to enforce proposal commits before apply and merge-before-archive discipline.

## Commands
- `npm run dev` — Next.js dev server (port 3000)
- `npm run build && npm start` — production build + serve
- `npm run lint` — ESLint only; no formatter or typecheck script in package.json
- `npx vitest` — run all tests (globals: true, environment: node). No test script defined.
- `npx vitest <file>` — run a single test file

## Architecture at a glance
- **Framework**: Next.js App Router (`src/app/`) with React 19, TypeScript strict mode, `@/*` → `./src/*` alias
- **Auth**: Clerk via middleware (`src/middleware.ts`). Clerk session is required for all API routes and server actions. Keys in `.env.local`.
- **Database**: In-memory SQLite (sql.js) persisted to `.data/smart-otter.db`. Schema initialized on first `getDb()` call via inline migrations — no migration tooling exists. Tables: `users`, `favorites` with indexes.
- **AI layer** (`src/lib/ai/`): ProviderInterface + factory (`createProvider`). Multi-provider fallback chain: Groq → Ollama (local). Shared prompt in `prompt.ts`. Providers use lazy env var validation — instantiation succeeds, search() throws if required keys are missing.
- **UI**: Dark mode toggle via `next-themes` with system preference detection + localStorage persistence. ThemeProvider wraps root layout.
- **API routes**: `/api/search`, `/api/favorites/save`, `/api/dev/cache-stats`, `/api/dev/clear-cache`
- **Dev mode**: `<DevPage />` conditionally rendered in root layout when `NODE_ENV === 'development'`.

## Environment Variables
Required for AI providers:
- `GROQ_API_KEY` — Groq provider (primary)
- `GROQ_MODEL` — Groq model name, defaults to `llama-3.1-8b-instant`
- `OLLAMA_BASE_URL` — Ollama endpoint URL, defaults to `http://localhost:11434`
- `OLLAMA_MODEL` — Ollama model name, defaults to `llama3`

## Gotchas
- SQLite DB state is per-process — concurrent requests can race on the singleton. No connection pooling or locking beyond sql.js's single-writer model.
- `.env*` files are gitignored; tests and API routes that depend on AI providers need env keys set at runtime or they return empty stubs.
- `shadcn` (v4.x) was used as a dependency but components come from `@base-ui/react`; no CLI scaffolding is run — add UI components by copying into `src/components/ui/`.


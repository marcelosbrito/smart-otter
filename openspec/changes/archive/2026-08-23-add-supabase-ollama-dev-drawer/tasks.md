## 1. Supabase Setup & Database Schema

- [x] 1.1 Create Supabase project (Free tier), record `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- [x] 1.2 Install `@supabase/supabase-js` dependency; remove `sql.js` and `@types/sql.js` from `package.json`
- [x] 1.3 Create Supabase SQL migration: `users`, `favorites`, and `knowledge_cache` tables with `expires_at` TTL column (mirrors existing schema from `src/lib/db/client.ts:60-79`)
- [x] 1.4 Verify table creation by running the SQL in Supabase dashboard

## 2. Database Client Replacement

- [x] 2.1 Create `src/lib/db/supabase-client.ts` with singleton Supabase client (public anon key for API routes, service role key for server actions)
- [x] 2.2 Update `src/lib/db/repositories/favorites.ts` to use Supabase client instead of sql.js database instance
- [x] 2.3 Update `src/lib/db/actions/favorites.ts` to use Supabase client for save/remove operations
- [x] 2.4 Remove `src/lib/db/client.ts`, `src/lib/db/index.ts`; delete `.data/smart-otter.db` and `.data/sql-wasm.wasm` references

## 3. Knowledge Cache Migration

- [x] 3.1 Rewrite `src/lib/cache/knowledge-cache.ts` to use PostgreSQL: store cache entries with `query`, `response` (JSONB), `created_at`, `expires_at = created_at + interval '24 hours'`
- [x] 3.2 Implement lazy TTL check on cache get — skip expired entries before returning
- [x] 3.3 Update `/api/dev/cache-stats` route to query PostgreSQL for entry count, oldest/newest timestamps
- [x] 3.4 Update `/api/dev/clear-cache` route to delete all rows from `knowledge_cache` table

## 4. Dev Drawer Component

- [x] 4.1 Create `src/components/dev-drawer/DevDrawer.tsx` — side panel popover with provider selection (Auto/Hybrid, Groq Cloud, Ollama/GPU Local) using `@base-ui/react` components
- [x] 4.2 Add gear icon trigger to the root layout header next to the Clerk user avatar
- [x] 4.3 Persist active provider selection in `localStorage` and restore on page navigation
- [x] 4.4 Wire cache stats display and clear-cache button into the Dev Drawer UI

## 5. Status Indicator Widget & AI Service Integration

- [x] 5.1 Create `src/components/search/SearchStatusWidget.tsx` — displays 🟢/🔵/⚪ indicator below search box with provider status
- [x] 5.2 Update `src/lib/ai/service.ts` to support dynamic runtime provider switching based on localStorage-stored preference (no restart needed)
- [x] 5.3 Implement Ollama tunnel ping check for the Dev Drawer — `GET` endpoint health, display online/offline state
- [x] 5.4 Replace `<DevPage />` rendering in root layout with the new Dev Drawer component

## 6. Cloudflare Tunnel Setup (User Documentation)

- [x] 6.1 Create `scripts/setup-tunnel.sh` script that runs `cloudflared tunnel --url http://localhost:11434` and outputs the public URL
- [x] 6.2 Update `.env.local.example` with documented Ollama tunnel setup instructions replacing the localhost default

## 7. Testing & Validation

- [x] 7.1 Run `npx vitest` — verify all existing tests pass against Supabase-backed database layer (34/36 pass; 2 AI provider tests fail due to missing local Ollama instance — not a code bug)
- [x] 7.2 Verify favorites save/view/remove flow end-to-end through API routes (confirmed working via raw HTTP calls)
- [x] 7.3 Verify knowledge cache TTL expiration and clear-cache endpoint behavior (clearCache fixed to delete all rows, TTL lazy check verified)
- [x] 7.4 Run `npm run lint` to confirm no ESLint errors (no errors found)

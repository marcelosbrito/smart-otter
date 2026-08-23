# Proposal: add-supabase-ollama-dev-drawer

## Why

Smart Otter's current sql.js (in-memory SQLite) persistence is per-process and volatile — data is lost on server restarts, preventing multi-user favorites and shared knowledge cache. Migrating to Supabase (PostgreSQL) enables durable, low-latency persistence for both favorites and cached search results. Additionally, replacing the full-page `<DevPage/>` with a compact Dev Drawer gives users direct control over AI provider selection without requiring developer access.

## What Changes

- **Database migration**: Replace sql.js/WASM SQLite with Supabase (PostgreSQL Free tier). Migrate `users` and `favorites` tables; replace in-memory knowledge cache with PostgreSQL-backed TTL cache.
- **Ollama connectivity**: Change `OLLAMA_BASE_URL` from `http://localhost:11434` to a Cloudflare Tunnel endpoint, enabling local GPU access without firewall/port exposure.
- **Dev Drawer UI**: Replace `<DevPage />` (full page) with a gear icon in the header that opens a side panel/popover for active provider selection (Auto/Hybrid, Groq Cloud, Ollama/GPU Local), with live ping status display.
- **Status indicator widget**: Add a small widget below the search box showing 🟢 Local GPU Engine or 🔵 Groq API with current state.

## Capabilities

### New Capabilities

- `supabase-database`: PostgreSQL-backed persistence for users, favorites, and knowledge cache with TTL support.
- `dev-drawer-provider-toggle`: Side-panel UI for runtime AI provider selection (Auto/Hybrid, Groq, Ollama) with live status indicators.

### Modified Capabilities

- `favorites`: Behavior unchanged; persistence layer changes from sql.js to Supabase PostgreSQL.
- `knowledge-cache`: Cache storage moves in-memory Map to PostgreSQL with TTL expiration; API routes `/api/dev/cache-stats` and `/api/dev/clear-cache` remain.
- `search-and-discover`: No behavioral change; cache-first retrieval continues via the new PostgreSQL-backed cache layer.

## Impact

- **Removed**: `sql.js`, `@types/sql.js` dependencies; `src/lib/db/client.ts`, `src/lib/db/index.ts`; `.data/smart-otter.db`.
- **Added**: `@supabase/supabase-js`; Supabase project + schema; `src/lib/db/supabase-client.ts`; Dev Drawer component in header.
- **Modified**: `src/lib/cache/knowledge-cache.ts` (PostgreSQL storage instead of in-memory Map); `src/lib/ai/service.ts` (provider URL resolution for tunnel-based Ollama); root layout (header gear icon, search box status widget).
- **API routes**: `/api/favorites/save`, `/api/auth/status` — database calls switch to Supabase client; cache endpoints use PostgreSQL.
- **Environment**: New `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; Ollama URL format changes for tunnel setup.

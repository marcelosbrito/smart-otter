## Context

Smart Otter currently uses sql.js (in-memory SQLite/WASM) for persistence and a full-page `<DevPage />` for developer mode. The in-memory store loses all data on server restart and cannot support multi-user favorites or shared knowledge cache. The Dev Page is overly intrusive for what amounts to provider toggling and cache management.

Existing ADRs:
- **ADR-0001** (AI Provider Interface): Still in force — the `ProviderInterface` + `createProvider()` factory pattern constrains how new provider selection is wired into the service layer.
- **ADR-0002** (SQLite for Data Persistence): Needs supersession — this change replaces SQLite with Supabase PostgreSQL, directly contradicting ADR-0002's decision while honoring its stated migration path.

## Goals / Non-Goals

**Goals:**
- Durable, shared persistence for favorites and knowledge cache via Supabase Free tier (PostgreSQL)
- Compact Dev Drawer replacing the full-page `<DevPage />` with provider selection and status indicators
- Ollama connectivity via Cloudflare Tunnel (`cloudflared`) instead of `localhost:11434`
- Zero additional infra cost — Supabase Free tier + user-hosted cloudflared tunnel

**Non-Goals:**
- Data migration from `.data/smart-otter.db` to Supabase (users start fresh)
- Multi-region or multi-instance deployment support
- Real-time sync between multiple users' caches (cache is per-query, not per-user)
- Ollama model management (download/switch models) — assumes user pre-configures `OLLAMA_MODEL`

## Decisions

### D1: Supabase over Prisma + self-hosted PostgreSQL
**Decision:** Use `@supabase/supabase-js` directly instead of adding Prisma as an ORM layer.

Rationale: The project has no complex query requirements — favorites and cache are simple CRUD operations with TTL filtering. Supabase's client library provides type-safe queries without the schema migration overhead that Prisma requires. Adding Prisma would introduce a build step (`prisma generate`) that conflicts with Next.js edge deployment constraints. The `Migration` note in ADR-0002 already acknowledges this path exists later.

**Alternatives considered:**
- **Prisma**: Overkill for 3 tables (users, favorites, knowledge_cache). Adds migration tooling complexity.
- **Direct `pg` driver**: No type safety, manual query building, no built-in connection pooling for serverless.

### D2: Knowledge cache TTL via PostgreSQL `expires_at` column
**Decision:** Store cache entries with a `created_at` and computed `expires_at = created_at + interval` in PostgreSQL. Cache lookup checks `NOW() < expires_at`; expired entries are deleted lazily on miss or periodically via the `/api/dev/clear-cache` endpoint.

Rationale: PostgreSQL's native timestamp arithmetic avoids external TTL dependencies (no Redis). The `knowledge_cache` table schema mirrors the existing in-memory Map key structure: `query TEXT PRIMARY KEY`, `response JSONB NOT NULL`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `expires_at TIMESTAMPTZ`.

**Alternatives considered:**
- **PostgreSQL `pg_cron`**: Requires Pro tier ($25/mo) for scheduled cleanup. Free tier does not support cron jobs.
- **Lazy cleanup only**: Accepts stale entries until `/api/dev/clear-cache` is called. Simpler but wastes storage on forgotten queries.

### D3: Dev Drawer as a client-side stateful popover (not server component)
**Decision:** The Dev Drawer uses React `useState` for open/close and active provider selection, persisted to `localStorage`. It renders as an absolute-positioned `<Popover>` from `@base-ui/react` triggered by a gear icon in the header.

Rationale: Provider selection is user preference data that does not need server persistence — it affects runtime behavior of the AI service layer (which already supports dynamic provider switching via `createProvider()` per ADR-0001). Storing in `localStorage` survives page navigation without API calls. The drawer only needs to invoke existing cache management endpoints (`/api/dev/cache-stats`, `/api/dev/clear-cache`).

**Alternatives considered:**
- **Server-side state (cookies)**: Unnecessary complexity for a dev-only toggle that resets on sign-out anyway.
- **Clerk user metadata**: Overkill; provider preference is ephemeral session data, not identity data.

### D4: Cloudflare Tunnel for Ollama instead of localhost binding
**Decision:** Users run `cloudflared tunnel --url http://localhost:11434` to expose their local Ollama instance via a public HTTPS URL. The `OLLAMA_BASE_URL` env var points to this tunnel endpoint.

Rationale: Cloudflare Tunnels provide automatic TLS termination, NAT traversal without port forwarding, and a stable hostname. This is more reliable than exposing `localhost:11434` directly and works behind corporate firewalls where port 11434 might be blocked. The ping status in the Dev Drawer simply `GET`s the tunnel endpoint's `/api/health` or `/v1/models`.

**Alternatives considered:**
- **ngrok**: Similar concept but cloudflared has a generous free tier and integrates well with existing Cloudflare usage patterns.
- **Direct localhost**: Fails behind NAT/firewalls; requires manual port forwarding on user routers.

## Risks / Trade-offs

[Risk: Supabase Free tier rate limits] → [Mitigation: Free tier supports 500MB database and 10k daily API calls — sufficient for MVP usage. Monitor via Supabase dashboard.]
[Risk: Cloudflare Tunnel requires user setup] → [Mitigation: Document tunnel setup in README; provide a `scripts/setup-tunnel.sh` script that generates a one-time URL.]
[Risk: No data migration from sql.js] → [Mitigation: Acceptable for MVP — users lose local-only favorites, but the app is early-stage and most users haven't accumulated meaningful data.]
[Risk: PostgreSQL TTL cleanup not automatic] → [Mitigation: Lazy deletion on cache miss + manual clear via Dev Drawer. Cache size stays bounded by query volume.]

## Migration Plan

1. **Supabase setup**: Create Supabase project, record `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. **Database schema**: Run SQL to create `users`, `favorites`, and `knowledge_cache` tables (schema mirrors existing sql.js migrations from `src/lib/db/client.ts:60-79`).
3. **Replace DB client**: Remove `sql.js` dependency; replace `src/lib/db/client.ts` with Supabase client (`src/lib/db/supabase-client.ts`). Update repository functions in `src/lib/db/repositories/` and actions in `src/lib/db/actions/`.
4. **Update knowledge cache**: Replace in-memory Map in `src/lib/cache/knowledge-cache.ts` with PostgreSQL-backed get/set/delete operations using the new client.
5. **Build Dev Drawer**: Create `src/components/dev-drawer/DevDrawer.tsx`, add gear icon trigger to header layout, replace `<DevPage />` rendering.
6. **Update AI service**: Modify `src/lib/ai/service.ts` to support dynamic provider switching via Dev Drawer state (no restart needed).
7. **Remove legacy code**: Delete `src/lib/db/client.ts`, `src/lib/db/index.ts`, `.data/smart-otter.db`; remove `sql.js` and `@types/sql.js` from dependencies.

**Rollback:** Revert to sql.js by restoring the original DB client files and reverting dependency changes. No Supabase data needs cleanup on rollback since it was empty at migration time.

## Open Questions

1. **Supabase row-level security**: Should favorites be protected via RLS policies, or is Clerk session validation in API routes sufficient for now? (Relevant to ADR-0002's "zero external infrastructure" philosophy — adding Supabase already changes that calculus.)
2. **Knowledge cache key format**: Should cache keys include the active provider name (e.g., `groq:Frontend Developer` vs `ollama:Frontend Developer`) so cached results don't mix across providers? Or use a single global cache keyed only by query text?
3. **ADR-0002 supersession**: This design directly contradicts ADR-0002's SQLite decision. The new ADR should explicitly supersede it and document why the migration path (which ADR-0002 already anticipated) was taken earlier than expected.

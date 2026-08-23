# ADR-0003 — Supabase PostgreSQL for Data Persistence

**Status:** accepted, supersedes ADR-0002  
**Supersedes:** ADR-0002 (SQLite for Data Persistence)  
**Date:** 2026-08-20  

## Context

ADR-0002 selected Better-SQLite3 / sql.js as the persistence layer because it offered zero external infrastructure cost and kept Smart Otter deployable as a single Next.js application. However, in-memory SQLite (sql.js) loses all data on server restarts, preventing multi-user favorites and shared knowledge cache — core features of the product vision.

ADR-0002's own Consequences section anticipated this: "Migration path to PostgreSQL or Prisma exists later." The Supabase Free tier now provides a managed PostgreSQL database at zero cost (500MB storage, 10k daily API calls), satisfying ADR-0002's original constraint while fixing the data loss problem.

## Decision

Use `@supabase/supabase-js` directly (no ORM layer) for all data persistence. Create a PostgreSQL database with three tables: `users`, `favorites`, and `knowledge_cache`. Cache entries include an `expires_at` column computed as `created_at + 24h` for TTL-based expiration, eliminating the need for external caching infrastructure or cron jobs.

## Consequences

- Data persists across server restarts; multi-user favorites and shared knowledge cache work correctly
- No ORM migration tooling needed — direct Supabase client queries suffice for simple CRUD
- Supabase Free tier limits (500MB, 10k daily API calls) are sufficient for MVP but may require upgrade at scale
- Knowledge cache TTL is implemented via `expires_at` timestamp with lazy cleanup on miss + manual clear endpoint; no automatic cron-based purge on the Free tier
- The `sql.js`, `@types/sql.js`, and `.data/smart-otter.db` dependencies are removed

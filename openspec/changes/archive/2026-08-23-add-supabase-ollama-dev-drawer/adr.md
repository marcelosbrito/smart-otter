# ADR Review Manifest

- Status: completed
- Review date: 2026-08-20

## Review Summary

ADR review completed for this change. One major durable architectural decision was introduced, replacing the prior SQLite persistence decision.

## In-Force ADRs Reviewed

- **ADR-0001** (AI Provider Interface) — `openspec/adr/0001-ai-provider-interface.md` — Still in force; constrains how provider selection is wired via `ProviderInterface` and `createProvider()` factory. This change honors that interface by adding dynamic runtime switching rather than modifying it.

## New Durable ADRs Created

- **ADR-0003** (Supabase PostgreSQL for Data Persistence) — `adr/0003-supabase-for-data-persistence.md` — Supersedes ADR-0002. Replaces sql.js/WASM SQLite with Supabase PostgreSQL, addressing the per-process data loss problem that ADR-0002's migration path anticipated.

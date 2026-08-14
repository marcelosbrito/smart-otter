# ADR-0002 — SQLite for Data Persistence

**Status:** accepted  
**Date:** 2025-08-14  

## Context

Smart Otter MVP needs a data store for user favorites. The project must remain zero-cost (no managed database services) and deployable as a single Next.js application on Vercel. External dependencies should be minimized to keep operational complexity low.

## Decision

Use Better-SQLite3, an embedded single-file SQLite database running in Node.js. The `.db` file is stored locally alongside the application code. A migration script initializes the schema (users and favorites tables) at startup. The database client module provides a simple API for CRUD operations that abstracts away raw SQL queries.

## Consequences

- Zero external infrastructure cost — no managed databases or connection pools needed
- Single `.db` file is easy to back up, version control (if gitignored), or migrate later
- SQLite handles concurrent reads well; write contention may occur under high concurrency with multiple server instances
- On Vercel's edge deployment model, local file writes are not supported — the database client must target Node.js-compatible deployments (e.g., Vercel Function Nodes or self-hosted)
- Migration path to PostgreSQL or Prisma exists later — the schema is standard SQL and the data access layer isolates queries behind a repository interface

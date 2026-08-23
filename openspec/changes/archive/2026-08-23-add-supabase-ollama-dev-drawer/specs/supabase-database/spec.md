## ADDED Requirements

### Requirement: Durable User and Favorite Storage via Supabase

The system MUST persist authenticated users and their favorites to a PostgreSQL database (Supabase Free tier) instead of in-memory SQLite, enabling multi-session durability across server restarts.

Feature: Smart Otter — Supabase Database

#### Scenario: System persists a user's favorite to PostgreSQL

- **GIVEN** an authenticated user clicks Save Favorite on a resource card
- **WHEN** the favorites save API route receives the request with the user's Clerk ID and resource data
- **THEN** the favorite is inserted into the Supabase `favorites` table
- **AND** the response confirms success to the client

#### Scenario: System retrieves favorites from PostgreSQL on page load

- **GIVEN** an authenticated user navigates to the Favorites page
- **WHEN** the favorites data fetches from the backend
- **THEN** resources are grouped by profession and displayed correctly
- **AND** each entry shows name, category, explanation, and a Remove button

#### Scenario: System removes a favorite from PostgreSQL

- **GIVEN** an authenticated user is viewing their favorites list
- **WHEN** the user clicks Remove on a saved resource
- **THEN** the record is deleted from the Supabase `favorites` table
- **AND** the UI updates immediately to reflect the removal

#### Scenario: System persists user registration via Clerk sync

- **GIVEN** a new user signs in for the first time via Clerk
- **WHEN** the system detects the user does not exist in PostgreSQL
- **THEN** a `users` record is created with their Clerk ID and email
- **AND** subsequent requests use the persisted user identity

### Requirement: Knowledge Cache Backed by PostgreSQL with TTL

The system MUST store knowledge cache entries in PostgreSQL with time-to-live expiration instead of an in-memory Map, enabling cache hits across server restarts and concurrent requests.

Feature: Smart Otter — Supabase Knowledge Cache

#### Scenario: System caches a successful AI response to PostgreSQL

- **GIVEN** the AI service returns valid categorized resources for a search query
- **WHEN** the knowledge cache layer stores the result
- **THEN** the entry is written to the `knowledge_cache` table in PostgreSQL with an expiration timestamp
- **AND** subsequent searches return cached results without invoking the AI provider

#### Scenario: System serves expired cache entries as miss

- **GIVEN** a cached search result for "Machine Learning Engineer" exists but has passed its TTL
- **WHEN** a user searches for "Machine Learning Engineer"
- **THEN** the system treats it as a cache miss and invokes the AI provider
- **AND** the fresh response is stored with an updated expiration timestamp

#### Scenario: System clears cache entries via API endpoint

- **GIVEN** cached results exist in PostgreSQL
- **WHEN** a user calls `/api/dev/clear-cache` from the Dev Drawer
- **THEN** all cache entries are deleted from the `knowledge_cache` table
- **AND** subsequent searches invoke the AI provider and regenerate fresh results

#### Scenario: System returns cache statistics from PostgreSQL

- **GIVEN** cached search results exist in the database
- **WHEN** a user calls `/api/dev/cache-stats` from the Dev Drawer
- **THEN** the response includes total entries, oldest entry age, and newest entry timestamp
- **AND** the data reflects current PostgreSQL state

## REMOVED Requirements

### Requirement: In-Memory SQLite (sql.js) Persistence
**Reason**: sql.js runs in-process with per-process memory isolation; data is lost on server restarts and cannot support concurrent multi-user access. Supabase provides durable, shared persistence at zero infrastructure cost.

**Migration**: All favorites and cache data will be managed through the new Supabase-backed layer. Existing `.data/smart-otter.db` files are not migrated — users start fresh with the new persistent store.

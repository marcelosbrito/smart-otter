# Knowledge Cache

**Purpose:** Cache successful AI responses keyed by search query in PostgreSQL with TTL expiration and serve cached results for repeated searches without invoking the AI provider, achieving sub-second response times across server restarts.

## Requirements

### Requirement: Cache Storage and Retrieval via PostgreSQL

The system MUST cache successful AI responses keyed by search query in PostgreSQL and serve cached results for repeated searches without invoking the AI provider.

Feature: Smart Otter — Knowledge Cache

#### Scenario: System caches a successful AI response to PostgreSQL

- **GIVEN** the AI service returns a valid resource list for "Blockchain Developer"
- **WHEN** the response is normalized by the AI service layer
- **THEN** the result is stored in the `knowledge_cache` table in PostgreSQL with an expiration timestamp (24-hour TTL)
- **AND** subsequent searches for the same query return cached results instantly

#### Scenario: System serves repeated searches from cache

- **GIVEN** "Cloud Architect" has been searched and cached previously in PostgreSQL
- **WHEN** a user searches for "Cloud Architect" again after some time
- **THEN** the system returns the cached response without invoking the AI provider
- **AND** the Developer Mode panel indicates a cache hit

#### Scenario: Cache expires or is cleared

- **GIVEN** a cached result exists for "Rust Developer" in PostgreSQL
- **WHEN** an administrator clears the cache through the Developer Mode panel
- **THEN** subsequent searches invoke the AI provider and regenerate fresh results
- **AND** the new response replaces the previous cached entry with an updated expiration timestamp

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

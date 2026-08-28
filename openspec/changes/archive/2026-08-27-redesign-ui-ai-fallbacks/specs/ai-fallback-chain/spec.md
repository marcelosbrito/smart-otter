## ADDED Requirements

### Requirement: AI Provider Fallback Chain

Feature: Smart Otter — AI Fallback

The system MUST implement a multi-tier AI provider fallback chain that automatically retries with alternative providers when the primary fails. The default order is: Groq → Ollama (local). Each tier must be independently configurable via environment variables.

#### Scenario: Primary provider succeeds on first attempt

- **GIVEN** the user submits a search query
- **WHEN** all AI providers are configured and operational
- **THEN** the system uses Groq as the primary provider
- **AND** the metrics report `provider: "Groq"` with `cacheHit: false`

#### Scenario: Primary provider fails, fallback activates

- **GIVEN** the user submits a search query and Groq returns an error (e.g., rate limit, 503)
- **WHEN** OLLAMA_BASE_URL is set (pointing to a running local Ollama instance)
- **THEN** the system automatically retries with Ollama as the fallback provider
- **AND** the metrics report `provider: "Ollama"` with an error field noting the primary failure

#### Scenario: All providers fail, no cache available

- **GIVEN** the user submits a search query and all AI providers return errors
- **WHEN** there is no cached result for this query
- **THEN** the system returns an error to the UI indicating temporary unavailability
- **AND** the error message suggests trying again later (no hardcoded fallback is used)

#### Scenario: Cached result serves when all providers are down

- **GIVEN** a previous search for "Data Scientist" succeeded and was cached
- **WHEN** the user searches for "Data Scientist" while all AI providers are offline
- **THEN** the system returns the cached result with `cacheHit: true`
- **AND** the metrics report includes an error noting that providers were unavailable

### Requirement: Groq Provider Implementation

The Groq provider MUST use the official `@groq/generative-ai` SDK (or compatible Groq HTTP API) to make real AI inference calls. It must produce the same JSON structure (`{ profession, categories }`) and handle Groq-specific rate limits with exponential backoff.

#### Scenario: Groq returns valid categorized resources

- **GIVEN** a search query is submitted
- **WHEN** the Groq provider receives the request with GROQ_API_KEY set
- **THEN** it calls the Groq API with an identical system prompt as other providers
- **AND** it parses and returns a valid `RawResponse` matching the expected schema

#### Scenario: Groq handles rate limiting gracefully

- **GIVEN** the Groq provider receives a 429 Too Many Requests response
- **WHEN** it retries with exponential backoff (base 1s, max 3 retries)
- **THEN** it succeeds on retry if the rate limit window has passed
- **AND** it throws a descriptive error after exhausting all retries

### Requirement: Ollama Local Provider Implementation

The Ollama provider MUST connect to a local Ollama instance via its REST API. It uses `OLLAMA_BASE_URL` (defaulting to `http://localhost:11434`) and requires a model name specified in `OLLAMA_MODEL` (defaulting to `llama3.2`). The system prompt must be identical across all providers for consistent output format.

#### Scenario: Ollama connects to local instance successfully

- **GIVEN** OLLAMA_BASE_URL points to a running Ollama server
- **WHEN** the search service invokes the Ollama provider
- **THEN** it sends a POST request to `/api/chat` or `/generate` with the system prompt and query
- **AND** it parses the JSON response into a valid `RawResponse`

#### Scenario: Ollama is unavailable

- **GIVEN** OLLAMA_BASE_URL points to a non-responsive host
- **WHEN** the search service invokes the Ollama provider
- **THEN** it throws an error that the service layer catches and reports in metrics
- **AND** this does not crash the application or block other providers

---

## REMOVED Requirements

### Requirement: Hardcoded Knowledge Base Fallback

**Reason**: Replaced by real AI fallback chain (Groq → Ollama). The knowledge base only covered 4 professions with static data, providing inconsistent UX compared to live AI search. With functional secondary providers, all queries can now be handled dynamically.

**Migration**: Delete `src/lib/ai/knowledge-base.ts` and remove its import from `service.ts`. The service layer's error handling no longer calls `getKnowledgeBaseResponse()` — it proceeds directly to cache fallback or throws an error if no cache exists.

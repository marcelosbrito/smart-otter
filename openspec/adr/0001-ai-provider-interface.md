# ADR-0001 — AI Provider Abstraction Interface

**Status:** accepted  
**Date:** 2025-08-14  

## Context

Smart Otter must support multiple AI providers (Gemini, Groq, Ollama) while keeping the frontend and business logic independent of any specific provider. The existing architecture document describes a Provider Manager component but does not define the interface contract or implementation pattern.

## Decision

Define a TypeScript `ProviderInterface` that all AI providers implement. The service layer orchestrates cache validation, provider invocation, response normalization, and caching behind this single abstraction. Providers are instantiated via a factory function (`createProvider(name)`). Only one provider is implemented per change; others have stub implementations to verify the interface contract.

## Consequences

- Adding a new provider requires implementing only `ProviderInterface` without touching frontend code or business logic
- The service layer can switch providers at runtime based on configuration
- Cache behavior remains identical regardless of which provider is active
- Future changes must implement and test stubs for all declared providers to verify interface compliance
- Provider-specific error handling (rate limits, timeouts) is isolated within each provider implementation

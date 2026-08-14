# Proposal: Smart Otter MVP

## Why

New career explorers waste time searching through fragmented resources across dozens of websites, forums, and outdated blogs instead of finding curated, structured knowledge hubs. Smart Otter solves this by delivering AI-curated resource lists for any profession or technical domain — fast, cached, and beautifully presented. This is built as an engineering portfolio project demonstrating modern full-stack development with clean architecture.

## What Changes

- Build a Next.js web application from scratch using App Router
- Implement AI-powered search that returns categorized resources (Tools, Communities, Learning Platforms, Documentation) with brief explanations for each recommendation
- Integrate Google Gemini via the free tier as the initial AI provider
- Create an intelligent cache layer that stores normalized AI responses and serves repeated searches instantly
- Add user authentication using Clerk (email + social login)
- Implement favorites system organized by profession
- Build a Developer Mode panel showing active provider, cache status, response source, and request timing

## Capabilities

### New Capabilities
- `search-and-discover`: Search any profession or technical domain and receive AI-curated resources with brief explanations for each recommendation
- `resource-categorization`: Group discovered resources into categories (Tools, Communities, Learning Platforms, Documentation)
- `knowledge-cache`: Store normalized AI responses and serve repeated searches from cache instantly
- `user-authentication`: Authenticate users via email or social login using Clerk
- `favorites`: Save favorite resources organized by profession for quick access later

### Modified Capabilities
(none — this is a greenfield project)

## Impact

**New systems:**
- Next.js application (frontend + API routes)
- AI service layer with Gemini integration and provider abstraction interface
- Knowledge cache (in-memory or file-based storage initially)
- Clerk authentication setup

**Dependencies:**
- Google Gemini API key (free tier)
- Clerk account for authentication
- Node.js 18+ runtime

**Architectural decisions already made (from vision/docs):**
- Next.js App Router with Tailwind CSS + shadcn/ui
- Provider abstraction layer supporting future Gemini, Groq, and Ollama integrations
- Cache-first strategy for performance and cost reduction
- Developer Mode for portfolio demonstration purposes

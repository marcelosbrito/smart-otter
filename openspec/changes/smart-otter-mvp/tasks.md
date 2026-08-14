# Tasks: Smart Otter MVP

## 1. Project Initialization

- [ ] 1.1 Run `npx create-next-app@latest smart-otter --typescript --tailwind --app` to scaffold the Next.js application
- [ ] 1.2 Initialize Tailwind CSS configuration and verify the dev server runs on `npm run dev`
- [ ] 1.3 Install shadcn/ui with `npx shadcn@latest init` using default theme settings
- [ ] 1.4 Add required base components: `Button`, `Input`, `Card`, `Tabs`, `Badge`, `Skeleton`, `Command`, `Dialog`, `DropdownMenu`

## 2. Clerk Authentication Setup

- [ ] 2.1 Create Clerk application at dashboard.clerk.dev and obtain publishable/secret keys
- [ ] 2.2 Add Clerk environment variables to `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- [ ] 2.3 Wrap the app with `<ClerkProvider>` in `app/layout.tsx` and configure middleware for auth route protection
- [ ] 2.4 Implement sign-in/sign-out UI components using Clerk's React components (`SignIn`, `UserButton`, `SignedIn`, `SignedOut`)
- [ ] 2.5 Verify email login, Google OAuth, and GitHub OAuth flows work in development mode

## 3. AI Service Layer — Provider Interface (ADR-0001)

- [ ] 3.1 Define the `ProviderInterface` TypeScript interface with `name`, `search(query: string): Promise<RawResponse>`, and `NormalizedResponse` type
- [ ] 3.2 Implement `GeminiProvider` using `@google/generative-ai` SDK, structured prompt for resource discovery, and JSON response parsing
- [ ] 3.3 Create stub implementations for `GroqProvider` and `OllamaProvider` that return null/empty to verify interface compliance
- [ ] 3.4 Implement the factory function `createProvider(name: string): ProviderInterface | null` with error handling for unknown providers
- [ ] 3.5 Write unit tests for each provider implementation verifying interface contract compliance

## 4. Knowledge Cache Implementation (Design Decision #3)

- [ ] 4.1 Create the `KnowledgeCache` class with in-memory Map storage and file persistence fallback using Node.js `fs` module
- [ ] 4.2 Implement cache key generation from search queries (lowercase, trimmed, slugified)
- [ ] 4.3 Write unit tests for cache get/set/clear operations including file persistence round-trip
- [ ] 4.4 Integrate cache into the service layer so cache hits bypass AI provider calls

## 5. Service Layer Orchestration

- [ ] 5.1 Implement the `searchService(query: string)` function that orchestrates cache lookup, provider invocation, normalization, and cache storage
- [ ] 5.2 Add response normalization logic converting raw AI output into structured `NormalizedResponse` with categories (Tools, Communities, Learning Platforms, Documentation)
- [ ] 5.3 Implement error handling for provider failures, network timeouts, and malformed responses with graceful degradation
- [ ] 5.4 Write integration tests verifying the full pipeline: cache miss → provider call → normalization → cache store

## 6. Search Page — Frontend Implementation (Specs: search-and-discover, resource-categorization)

- [ ] 6.1 Create `app/search/page.tsx` with a search form using shadcn Input and Button components
- [ ] 6.2 Implement the server action or API route (`/api/search`) that calls the service layer and returns normalized results
- [ ] 6.3 Build the resource display component showing categorized sections as tabs or collapsible accordions (shadcn Tabs + Collapsible)
- [ ] 6.4 Add loading states with shadcn Skeleton components during AI response fetching
- [ ] 6.5 Implement empty state and validation message when search query is empty or invalid
- [ ] 6.6 Verify spec scenarios: search with cached results, uncached results, empty query handling

## 7. Developer Mode Panel (Design Decision #6)

- [ ] 7.1 Create `app/dev/page.tsx` wrapped in a route group that returns null in production (`NODE_ENV !== 'development'`)
- [ ] 7.2 Display cache hit/miss status, active provider name, and average request duration from recent searches
- [ ] 7.3 Implement the "Clear Cache" button that calls the service layer's `cache.clear()` method with confirmation dialog
- [ ] 7.4 Add developer mode toggle in settings to enable/disable the panel visibility without code changes

## 8. Data Persistence — SQLite Schema (ADR-0002)

- [ ] 8.1 Install Better-SQLite3 and create the database client module (`src/lib/db/client.ts`) with connection pooling
- [ ] 8.2 Write the schema migration script creating `users` and `favorites` tables with proper indexes
- [ ] 8.3 Implement the repository layer (`src/lib/db/repositories/favorites.ts`) providing CRUD operations for favorites
- [ ] 8.4 Create a startup script that initializes the database file and runs migrations if not already present

## 9. Favorites Feature (Specs: favorites)

- [ ] 9.1 Create server actions for `saveFavorite`, `removeFavorite`, and `getFavorites` that interact with the SQLite repository layer
- [ ] 9.2 Implement `app/favorites/page.tsx` displaying resources grouped by profession using shadcn Card components
- [ ] 9.3 Add the Save Favorite button on resource cards in search results (visible only when authenticated)
- [ ] 9.4 Implement unauthenticated user redirect to sign-in when attempting to save a favorite, with return navigation after login
- [ ] 9.5 Write unit tests for server actions verifying database operations and authentication checks

## 10. Integration, Polish, and Validation

- [ ] 10.1 Run `openspec validate smart-otter-mvp --type change --strict` to verify all spec scenarios are satisfied
- [ ] 10.2 Add responsive design adjustments for mobile/tablet breakpoints using Tailwind CSS media queries
- [ ] 10.3 Implement proper error boundaries and fallback UI for API failures throughout the application
- [ ] 10.4 Add basic accessibility improvements: ARIA labels, keyboard navigation, focus management in modals/dialogs
- [ ] 10.5 Create a production build (`npm run build`) and verify no TypeScript errors or missing environment variables

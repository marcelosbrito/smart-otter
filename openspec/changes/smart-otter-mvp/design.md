# Design: Smart Otter MVP

## Context

Smart Otter is a greenfield portfolio project built to demonstrate modern full-stack engineering, AI-assisted development, and scalable architecture. The application helps users discover curated resources for any profession or technical domain using AI-generated content with intelligent caching. The existing documents (vision.md, architecture.md, decisions.md) establish the high-level direction: Next.js App Router, Tailwind CSS + shadcn/ui, Clerk authentication, Gemini free tier as the initial AI provider, and a cache-first strategy.

No ADRs exist yet in `openspec/changes/smart-otter-mvp/` — they will be created by the adr artifact after this design step. The existing project-level decisions.md serves as historical context but is not an in-force ADR for this change.

## Goals / Non-Goals

**Goals:**
- Implement a fully functional MVP with search, AI-powered resource discovery, caching, authentication, and favorites
- Establish a provider abstraction layer that allows swapping Gemini for Groq or Ollama without frontend changes
- Achieve sub-second response times for repeated searches via the cache layer
- Deliver a clean, accessible UI using shadcn/ui components

**Non-Goals:**
- Multi-provider implementation (only Gemini free tier is built; Groq/Ollama interfaces are stubbed)
- Personalized recommendations or learning roadmaps (future enhancements)
- Community-contributed resources or quality voting
- Mobile-native applications (responsive web only)
- Real-time collaboration features

## Decisions

### 1. Project Structure — Monorepo-style App Router

**Choice:** Single Next.js application with App Router, using `app/` for routes and `src/lib/` for shared libraries.

```
smart-otter/
├── app/
│   ├── (auth)/          # Auth-related routes (Clerk wrappers)
│   ├── search/          # Search page and API route
│   ├── favorites/       # Favorites dashboard
│   └── layout.tsx       # Root layout with Clerk provider
├── src/
│   ├── lib/
│   │   ├── ai/          # AI service layer, providers, normalization
│   │   ├── cache/       # Knowledge cache implementation
│   │   ├── auth/        # Auth utilities (Clerk session helpers)
│   │   └── db/          # Database client and schema (if using one)
│   ├── components/      # Shared UI components
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── tests/               # Test files matching src/lib structure
```

**Rationale:** The App Router provides server-side rendering, streaming responses, and route-level API handlers in a single codebase. This is the standard Next.js pattern recommended by Vercel and aligns with ADR-001.

### 2. AI Service Layer — Provider Interface Pattern

**Choice:** Define a `ProviderInterface` in TypeScript that all AI providers implement. The service layer orchestrates cache validation, provider invocation, response normalization, and caching.

```typescript
interface ProviderInterface {
  name: string;
  search(query: string): Promise<RawResponse>;
}

interface RawResponse {
  profession: string;
  categories: Record<string, Resource[]>;
}

interface NormalizedResponse {
  profession: string;
  tools: Resource[];
  communities: Resource[];
  learningPlatforms: Resource[];
  documentation: Resource[];
}

interface KnowledgeCache {
  get(queryKey: string): NormalizedResponse | null;
  set(queryKey: string, response: NormalizedResponse): void;
  clear(): void;
}
```

**Rationale:** This abstraction (already captured in ADR-004) enables swapping providers without changing the frontend or business logic. For MVP, only `GeminiProvider` is implemented. The other two (`GroqProvider`, `OllamaProvider`) have stub implementations returning null/empty to verify the interface contract.

### 3. Cache Implementation — In-Memory with File Persistence Fallback

**Choice:** Start with an in-memory cache using a Map data structure for MVP simplicity. Add file-based persistence (JSON file on disk) as a fallback so cache survives server restarts during development.

```typescript
class KnowledgeCache {
  private memoryStore = new Map<string, NormalizedResponse>();
  private persistPath: string;

  constructor() {
    this.persistPath = path.join(process.cwd(), '.cache', 'results.json');
  }

  get(queryKey: string): NormalizedResponse | null { ... }
  set(queryKey: string, response: NormalizedResponse): void { ... }
  clear(): void { ... }
}
```

**Rationale:** In-memory cache is fast and requires zero external dependencies for MVP. File persistence avoids losing cached results on dev server restarts. If the project scales to production with multiple instances, Redis can replace this implementation without changing the interface — it's an internal detail.

### 4. Authentication — Clerk with Session-Based Access Control

**Choice:** Use Clerk's hosted sign-in UI and Next.js middleware for route protection. Unauthenticated users can search but cannot access favorites or save items.

```typescript
// middleware.ts
export async function middleware(request: Request) {
  return clerkMiddleware()(request);
}

export const config = { matcher: ['/search/:path*', '/favorites/:path*'] };
```

**Rationale:** Clerk provides email + social login out of the box with minimal configuration. The hosted UI avoids building custom auth flows, keeping focus on the core AI/search functionality. Middleware protects routes server-side while Clerk's React components handle client-side state.

### 5. Data Persistence — Optional SQLite via Better-SQLite3

**Choice:** For MVP favorites storage, use Better-SQLite3 (single file database) embedded in Node.js rather than a managed cloud database service. This keeps costs at zero and avoids external dependencies.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  profession TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  resource_url TEXT NOT NULL,
  category TEXT NOT NULL,
  explanation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(clerk_id)
);

CREATE INDEX idx_favorites_user_profession ON favorites(user_id, profession);
```

**Rationale:** Better-SQLite3 requires no external infrastructure. The single `.db` file is easy to version control (or gitignore), deploy with, and manage during development. If the project transitions to production at scale later, a migration path to PostgreSQL or Prisma exists — the schema is standard SQL.

### 6. Developer Mode — Route-Protected Panel

**Choice:** Implement `/dev` as a separate route group accessible only during development (`process.env.NODE_ENV === 'development'`). The panel displays cache hit/miss status, active provider name, request duration, and provides a "Clear Cache" button.

```typescript
// app/dev/layout.tsx
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') return null;
  return <>{children}</>;
}
```

**Rationale:** Developer Mode exists for portfolio demonstration during technical interviews. Restricting it to development mode prevents accidental exposure in production builds while keeping the implementation simple.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Gemini free tier rate limits may block high-volume searches | Cache-first strategy reduces API calls significantly; implement exponential backoff if rate-limited |
| In-memory cache loses data on server restart | File persistence fallback ensures development continuity |
| Better-SQLite3 file locking issues with concurrent requests | SQLite handles this natively; use WAL mode for better concurrency |
| Clerk free tier has limited monthly active users | Acceptable for MVP/portfolio — not a production platform |
| AI responses may vary in quality or format between calls | Normalization layer enforces consistent `NormalizedResponse` schema; cache ensures consistency for repeated queries |

## Migration Plan

This is a greenfield project, so no migration plan applies. Deployment steps:

1. Initialize Next.js project with TypeScript and App Router
2. Configure Clerk environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
3. Set Gemini API key in `.env.local` (never commit)
4. Run database schema migration via Better-SQLite3 setup script
5. Deploy to Vercel with production environment variables

## Open Questions

1. **Should we use a real database from the start or wait until favorites grow?** — Decision: SQLite for MVP; upgrade path exists later.
2. **What cache TTL should we set for expired entries?** — Decision: No TTL initially (cache lives forever unless cleared manually via Developer Mode). Can add TTL in future if needed.
3. **Should Developer Mode be accessible to authenticated users only, or development environment only?** — Decision: Development environment only per ADR-006 intent.
4. **The existing architecture.md mentions a "Provider Manager" component separate from the interface pattern.** — This design merges Provider Manager into the service layer as a simple factory function (`createProvider(name)`). No new ADR needed; this is an implementation detail refinement.

# Smart Otter

AI-powered resource discovery platform for professionals and technical domains. Search any profession or domain to discover curated tools, communities, learning platforms, and documentation — powered by Groq Cloud and local Ollama instances.

## Features

- **AI Resource Search** — Enter a profession (e.g., "Frontend Developer") to get categorized resources from AI models
- **Multi-Provider Fallback** — Auto-switches between Groq Cloud and local Ollama when one is unavailable
- **Favorites System** — Save and organize resources by profession with persistent storage
- **Knowledge Cache** — Cached results persist across server restarts via PostgreSQL TTL cache
- **Developer Mode** — Gear icon in header (dev only) for provider selection, status indicators, and cache management
- **Dark/Light Theme** — Toggle between themes with system preference detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.3 (App Router), React 19, TypeScript strict mode |
| Auth | Clerk (session-based, middleware-protected) |
| Database | Supabase PostgreSQL (Free tier) — users, favorites, knowledge_cache tables |
| AI Providers | Groq Cloud (primary) + Ollama local/GPU (fallback via Cloudflare Tunnel) |
| UI Components | @base-ui/react, Tailwind CSS v4, Lucide icons |
| Styling | Theme-aware with dark mode support |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # API endpoints (search, favorites, auth, dev)
│   ├── favorites/          # Favorites listing page
│   ├── search/             # Search results page
│   └── sign-*/             # Clerk auth pages
├── components/
│   ├── auth/               # Header, client-auth
│   ├── dev-drawer/         # Dev mode side panel (DevDrawer)
│   ├── search/             # Status indicator widget
│   └── ui/                 # Base UI primitives (button, card, dialog, etc.)
├── lib/
│   ├── ai/                 # AI provider interface, factory, Groq/Ollama implementations
│   ├── cache/              # PostgreSQL-backed knowledge cache with TTL
│   └── db/                 # Supabase client, repositories, actions, types
└── middleware.ts           # Clerk auth middleware
```

## Getting Started

### Prerequisites

- Node.js 18+ (v20 recommended)
- A Clerk account for authentication
- A Supabase project (Free tier) for PostgreSQL storage
- Optional: Groq API key and/or Ollama with GPU for AI search

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smart-otter

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local` with your credentials:

```bash
# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Providers
GROQ_API_KEY=your_groq_api_key          # Required for primary provider
OLLAMA_BASE_URL=http://localhost:11434  # Local Ollama or Cloudflare Tunnel URL
OLLAMA_MODEL=llama3.2                   # Model to use with Ollama

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Running the App

```bash
npm run dev        # Start development server on port 3000
npm run build      # Production build
npm start          # Serve production build
```

Open [http://localhost:3000](http://localhost:3000) to use Smart Otter.

## Cloudflare Tunnel Setup (Optional — for Remote Ollama)

To expose a local Ollama instance via HTTPS without port forwarding:

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
2. Run the setup script: `bash scripts/setup-tunnel.sh`
3. Copy the generated HTTPS URL into `OLLAMA_BASE_URL` in `.env.local`

The Dev Drawer's status widget will ping this endpoint and show online/offline state.

## Database Schema

Smart Otter uses three PostgreSQL tables managed by Supabase:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Clerk user identity sync | `clerk_id` (unique), `email`, `created_at` |
| `favorites` | Saved resources per user | `user_id`, `profession`, `resource_name`, `category`, `explanation` |
| `knowledge_cache` | Cached AI search results with TTL | `query_key` (PK), `response` (JSONB), `expires_at` (24h TTL) |

All tables have Row Level Security enabled with service-role policies for API route access. Clerk session validation is enforced at the API layer.

## Developer Mode

In development mode, a gear icon appears in the header next to your user avatar. Clicking it opens a side panel with:

- **Provider Selection** — Choose between Auto/Hybrid (Groq → Ollama fallback), Groq Cloud only, or Ollama Local
- **Status Indicator** — Live ping status for each provider below the search box
- **Cache Management** — View cache entry count and clear all cached results

Provider selection persists in `localStorage` across page navigation.

## Testing

```bash
npx vitest              # Run all tests (Node environment, no browser needed)
npx vitest tests/db/    # Database layer tests only
npx vitest tests/auth/  # Auth integration tests only
npx eslint . --ext .ts,.tsx   # Lint check
```

**Note:** AI provider tests (`tests/ai/provider.test.ts`) require a running Ollama instance to pass. The Groq provider tests work without configuration.

## Architecture Decisions

- **ADR-0001**: AI Provider Interface — Factory pattern for pluggable providers
- **ADR-0003**: Supabase PostgreSQL for Data Persistence — Replaced in-memory SQLite with durable cloud storage

## License

MIT

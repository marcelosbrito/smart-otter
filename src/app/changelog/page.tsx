export default function ChangelogPage() {
  const releases = [
    {
      version: 'v0.4.1',
      date: 'September 1, 2026',
      title: 'UI Polish — Favicon, Dev Drawer OK Button, Search Header Cleanup',
      changes: [
        'Optimized favicon SVG for legibility at 16–32px (reduced viewBox to 32×32, explicit hex colors)',
        'Added visible "OK" button in Dev Drawer footer that closes the dialog',
        'Removed "Results for Profession" subheading from search results page (provider badge and cache/latency metrics retained)',
      ],
    },
    {
      version: 'v0.4.0',
      date: 'August 28, 2026',
      title: 'Sticky Header + Footer + Supporting Pages',
      changes: [
        'Added sticky header with scroll-triggered translucent glass effect (backdrop blur)',
        'Added minimal global footer with brand name, internal links (Changelog, FAQ, Privacy), creator attribution, and social icons (GitHub, X, LinkedIn)',
        'Created /changelog page with chronological release history',
        'Created /faq page with accessible accordion-style questions covering product features',
        'Created /privacy page accurately describing data collection practices',
      ],
    },
    {
      version: 'v0.3.1',
      date: 'August 28, 2026',
      title: 'UI Polish — Capuccino/Aurora Palettes',
      changes: [
        'Replaced default shadcn neutral themes with custom light (Capuccino) and dark (Aurora Borealis) color palettes',
        'Added otter face SVG icon to the header logo',
        'Increased resource card height to display 4 lines of explanation text for improved readability',
        'Moved provider status indicator from search page into the Dev Drawer side panel',
        'Repositioned dark mode toggle between dev gear icon and user avatar in header controls',
        'Added profession name heading above category carousels on search results page',
      ],
    },
    {
      version: 'v0.3.0',
      date: 'August 27, 2026',
      title: 'Horizontal Carousels + TASA Orbiter Typography',
      changes: [
        'Replaced vertical resource lists with horizontal carousels per category (Tools, Communities, Learning Platforms, Documentation)',
        'Applied TASA Orbiter as the primary typeface across all UI elements',
        'Fixed hydration mismatch from Clerk color-scheme injection',
        'Fixed favorites FK constraint, provider selection, and cache extraction bugs',
      ],
    },
    {
      version: 'v0.2.1',
      date: 'August 23, 2026',
      title: 'Supabase Migration + Dev Drawer Provider Toggle',
      changes: [
        'Migrated from in-memory SQLite to Supabase PostgreSQL for durable data persistence across server restarts',
        'Added Dev Drawer side panel with AI provider selection (Groq Cloud, Ollama Local, Auto/Hybrid)',
        'Fixed favorites FK constraint and cache extraction bugs',
      ],
    },
    {
      version: 'v0.2.0',
      date: 'August 17–20, 2026',
      title: 'Dark Mode + AI Fallback Chain',
      changes: [
        'Added dark mode toggle with smooth theme transitions across all pages',
        'Implemented Groq Cloud as primary AI provider with Ollama local fallback (Groq → Ollama chain)',
        'Redesigned landing page with hero section, feature cards, and gradient accents',
        'Enhanced search results page with animated shimmer skeletons and staggered fade-in animations',
        'Added provider attribution badge below profession heading on search results',
        'Removed deprecated knowledge-base fallback in favor of AI provider chain',
        'Fixed sql.js WASM loading issue for favorites page on Windows',
      ],
    },
    {
      version: 'v0.1.0',
      date: 'August 16–17, 2026',
      title: 'Initial Release',
      changes: [
        'AI-powered profession search using Google Gemini with structured resource recommendations',
        'Categorized results: Tools, Communities, Learning Platforms, Documentation',
        'In-memory knowledge cache with file persistence for repeated searches',
        'Favorites system with SQLite storage (save, view, remove resources)',
        'Clerk authentication with email and OAuth (Google, GitHub) sign-in flows',
        'Developer mode panel for cache management and search diagnostics',
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Changelog</h1>
      <p className="text-muted-foreground mb-10">
        What shipped, when, and why. Newest at the top.
      </p>

      <div className="space-y-10">
        {releases.map((release) => (
          <section key={release.version + release.date}>
            <header className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {release.version.replace('v', '')}
                </span>
                <span>{release.title}</span>
              </h2>
              <time className="text-sm text-muted-foreground mt-1">{release.date}</time>
            </header>

            <ul className="space-y-2 ml-4">
              {release.changes.map((change, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed list-disc marker:text-primary">
                  {change}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

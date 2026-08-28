export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: August 28, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">What this policy covers</h2>
          <p className="text-muted-foreground">
            Smart Otter is a single-user web application. This page describes what data is collected, where it is stored, and how it is used. If a feature is not implemented, it is explicitly noted as such.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Authentication</h2>
          <p className="text-muted-foreground">
            Smart Otter uses Clerk for authentication (email login, Google OAuth, GitHub OAuth). Your email address and Clerk user ID are stored in the application database to enable favorites and cache features. Clerk handles all password management, session tokens, and OAuth flows. See{' '}
            <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              clerk.com
            </a>{' '}
            for Clerk&apos;s own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Favorites</h2>
          <p className="text-muted-foreground">
            When you save a resource as a favorite, the following data is stored in PostgreSQL via Supabase: your user ID, the profession context, the resource name, its category (Tools, Communities, Learning Platforms, or Documentation), and a brief explanation. This data is accessible only to you through your authenticated session.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Search cache</h2>
          <p className="text-muted-foreground">
            Search queries and their AI-generated results are cached in PostgreSQL with a 24-hour time-to-live. The cache stores a normalized query key (lowercase, hyphenated) and the full structured response as JSONB. Cached entries are automatically purged after 24 hours or when they contain empty results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">AI provider requests</h2>
          <p className="text-muted-foreground">
            When you perform a search, your query is sent to an AI model. If you use Groq Cloud, the request goes directly to Groq&apos;s API using your own API key. If you use Ollama, the request goes to the URL you configured (e.g., a local instance or a Cloudflare Tunnel). Smart Otter does not intercept, log, or store the raw AI response beyond the cache described above. See the respective provider&apos;s privacy policy for details on how they process your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Analytics and tracking</h2>
          <p className="text-muted-foreground">
            Smart Otter does not use any analytics services, advertising cookies, or third-party trackers. No page views, referrers, or user behavior data are collected by the application itself.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Data retention</h2>
          <p className="text-muted-foreground">
            Favorites persist indefinitely until you remove them. Search cache entries expire after 24 hours. You can clear all cached data at any time via Developer Mode (gear icon → Cache Management). There is no automated data export or deletion endpoint for favorites at this time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">
            Questions about this policy?{' '}
            <a href="https://github.com/marcelosbrito/smart-otter" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              Open an issue on GitHub
            </a>{' '}
            or reach out to{' '}
            <a href="https://x.com/_marcelo_brito" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              @_marcelo_brito
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

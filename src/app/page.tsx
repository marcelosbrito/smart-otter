import Link from 'next/link';
import { Search, Database, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center px-6 py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15]">
            Find Any Profession&rsquo;s Best Resources
            <br />
            <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enter any profession or technical domain. Get curated tools, communities, learning platforms, and documentation — instantly.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Search',
                description: 'Enter any profession — get tailored results from multiple AI providers with automatic fallback.',
              },
              {
                icon: Database,
                title: 'Curated Resources',
                description: 'Tools, communities, learning platforms, and documentation organized by category for every field.',
              },
              {
                icon: Search,
                title: 'Instant Results from Cache',
                description: 'Repeated searches are lightning fast — results are cached so you never wait twice for the same profession.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-4 p-6 rounded-xl border bg-card text-card-foreground hover:bg-secondary/50 transition-colors"
              >
                <Icon className="w-10 h-10 text-primary" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

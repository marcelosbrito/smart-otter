import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Smart Otter
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Discover curated resources for any profession or technical domain using AI-powered search.
      </p>
      <div className="flex gap-3">
        <Link href="/search" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Start Searching
        </Link>
      </div>
    </div>
  );
}
